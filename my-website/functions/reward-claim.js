// METFLIX - Secure Server-Side Daily Reward
// Step 4 - Reward History / Transaction Records

const PROJECT_ID = "metflix-e8145";

const FIREBASE_API_KEY =
  "AIzaSyCprwxcwbJm5Qu-IjVQxKxBuseakVu16dY";

const TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const REWARDS = [
  10,
  15,
  20,
  25,
  30,
  40,
  100
];


// ============================================
// JSON RESPONSE
// ============================================

function json(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      }
    }
  );

}


// ============================================
// BASE64URL
// ============================================

function base64UrlEncode(bytes) {

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

}


function base64UrlDecode(value) {

  const base64 =
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(
        value.length +
        (4 - value.length % 4) % 4,
        "="
      );

  const binary =
    atob(base64);

  const bytes =
    new Uint8Array(binary.length);

  for (
    let i = 0;
    i < binary.length;
    i++
  ) {

    bytes[i] =
      binary.charCodeAt(i);

  }

  return bytes;

}


// ============================================
// CREATE GOOGLE ACCESS TOKEN
// ============================================

async function createAccessToken(
  serviceAccount
) {

  const now =
    Math.floor(
      Date.now() / 1000
    );


  const header = {
    alg: "RS256",
    typ: "JWT"
  };


  const claim = {

    iss:
      serviceAccount.client_email,

    scope:
      "https://www.googleapis.com/auth/datastore",

    aud:
      TOKEN_URL,

    iat:
      now,

    exp:
      now + 3600

  };


  const encodedHeader =
    base64UrlEncode(
      new TextEncoder().encode(
        JSON.stringify(header)
      )
    );


  const encodedClaim =
    base64UrlEncode(
      new TextEncoder().encode(
        JSON.stringify(claim)
      )
    );


  const unsignedToken =
    encodedHeader +
    "." +
    encodedClaim;


  const privateKeyBase64 =
    serviceAccount.private_key
      .replace(
        "-----BEGIN PRIVATE KEY-----",
        ""
      )
      .replace(
        "-----END PRIVATE KEY-----",
        ""
      )
      .replace(
        /\s/g,
        ""
      );


  const privateKey =
    await crypto.subtle.importKey(

      "pkcs8",

      base64UrlDecode(
        privateKeyBase64
      ),

      {
        name:
          "RSASSA-PKCS1-v1_5",

        hash:
          "SHA-256"
      },

      false,

      ["sign"]

    );


  const signature =
    await crypto.subtle.sign(

      {
        name:
          "RSASSA-PKCS1-v1_5"
      },

      privateKey,

      new TextEncoder().encode(
        unsignedToken
      )

    );


  const assertion =
    unsignedToken +
    "." +
    base64UrlEncode(
      new Uint8Array(signature)
    );


  const response =
    await fetch(
      TOKEN_URL,
      {

        method:
          "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body:
          new URLSearchParams({

            grant_type:
              "urn:ietf:params:oauth:grant-type:jwt-bearer",

            assertion:
              assertion

          })

      }
    );


  if (!response.ok) {

    console.error(
      "GOOGLE TOKEN ERROR:",
      await response.text()
    );

    throw new Error(
      "Server authentication failed."
    );

  }


  const data =
    await response.json();


  return data.access_token;

}


// ============================================
// VERIFY FIREBASE ID TOKEN
// ============================================

async function verifyFirebaseToken(
  idToken
) {

  const response =
    await fetch(

      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,

      {

        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            idToken
          })

      }

    );


  if (!response.ok) {

    console.error(
      "FIREBASE TOKEN ERROR:",
      await response.text()
    );

    throw new Error(
      "Invalid Firebase login."
    );

  }


  const data =
    await response.json();


  if (
    !data.users ||
    !data.users.length
  ) {

    throw new Error(
      "Firebase user not found."
    );

  }


  return data.users[0];

}


// ============================================
// GET USER DOCUMENT
// ============================================

async function getUser(
  accessToken,
  uid
) {

  const response =
    await fetch(

      `${FIRESTORE_BASE}/users/${encodeURIComponent(uid)}`,

      {

        headers: {

          Authorization:
            `Bearer ${accessToken}`

        }

      }

    );


  if (
    response.status === 404
  ) {

    return null;

  }


  if (!response.ok) {

    console.error(
      "FIRESTORE GET ERROR:",
      await response.text()
    );

    throw new Error(
      "Unable to read user data."
    );

  }


  return response.json();

}


// ============================================
// CREATE RANDOM TRANSACTION ID
// ============================================

function createTransactionId() {

  const randomPart =
    crypto.randomUUID();

  return `daily_${Date.now()}_${randomPart}`;

}


// ============================================
// UPDATE REWARD + CREATE HISTORY
// ATOMIC FIRESTORE COMMIT
// ============================================

async function updateReward(
  accessToken,
  uid,
  userDocument,
  reward,
  today,
  nextDay,
  rewardDay
) {

  const fields =
    userDocument.fields || {};


  const currentPoints =
    Number(
      fields.points?.integerValue ||
      fields.points?.doubleValue ||
      0
    );


  const newPoints =
    currentPoints + reward;


  const userDocumentName =
    `projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;


  // ============================================
  // REWARD HISTORY DOCUMENT
  // ============================================

  const transactionId =
    createTransactionId();


  const historyDocumentName =
    `projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}/rewardHistory/${transactionId}`;


  const claimedAt =
    new Date().toISOString();


  // ============================================
  // USER UPDATE
  // ============================================

  const userUpdate = {

    update: {

      name:
        userDocumentName,

      fields: {

        points: {

          integerValue:
            String(newPoints)

        },

        lastLoginReward: {

          stringValue:
            today

        },

        loginRewardDay: {

          integerValue:
            String(nextDay)

        }

      }

    },

    // This is important.
    // If another request changed the user document
    // after we read it, this write fails instead
    // of blindly overwriting the newer data.

    currentDocument: {

      updateTime:
        userDocument.updateTime

    }

  };


  // ============================================
  // HISTORY CREATE
  // ============================================

  const historyCreate = {

    update: {

      name:
        historyDocumentName,

      fields: {

        type: {

          stringValue:
            "daily_login"

        },

        day: {

          integerValue:
            String(rewardDay)

        },

        reward: {

          integerValue:
            String(reward)

        },

        pointsBefore: {

          integerValue:
            String(currentPoints)

        },

        pointsAfter: {

          integerValue:
            String(newPoints)

        },

        claimedAt: {

          timestampValue:
            claimedAt

        },

        date: {

          stringValue:
            today

        }

      }

    },

    currentDocument: {

      exists:
        false

    }

  };


  // ============================================
  // ATOMIC COMMIT
  // ============================================

  const response =
    await fetch(

      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents:commit`,

      {

        method:
          "POST",

        headers: {

          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify({

            writes: [

              userUpdate,

              historyCreate

            ]

          })

      }

    );


  if (!response.ok) {

    const errorText =
      await response.text();


    console.error(
      "FIRESTORE ATOMIC UPDATE ERROR:",
      errorText
    );


    return {

      success:
        false,

      error:
        errorText

    };

  }


  return {

    success:
      true,

    transactionId:
      transactionId,

    pointsBefore:
      currentPoints,

    pointsAfter:
      newPoints

  };

}


// ============================================
// TODAY
// ============================================

function getToday() {

  const now =
    new Date();

  return (

    now.getUTCFullYear() +

    "-" +

    String(
      now.getUTCMonth() + 1
    ).padStart(2, "0") +

    "-" +

    String(
      now.getUTCDate()
    ).padStart(2, "0")

  );

}


// ============================================
// MAIN FUNCTION
// ============================================

export async function onRequest(
  context
) {

  // ============================================
  // POST ONLY
  // ============================================

  if (
    context.request.method !== "POST"
  ) {

    return json(
      {
        success:
          false,

        message:
          "POST method required."
      },

      405
    );

  }


  try {

    // ==========================================
    // CHECK AUTHORIZATION
    // ==========================================

    const authorization =
      context.request.headers.get(
        "Authorization"
      );


    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {

      return json(
        {
          success:
            false,

          message:
            "Authentication required."
        },

        401
      );

    }


    const idToken =
      authorization
        .substring(7)
        .trim();


    if (!idToken) {

      return json(
        {
          success:
            false,

          message:
            "Invalid authentication token."
        },

        401
      );

    }


    // ==========================================
    // VERIFY FIREBASE USER
    // ==========================================

    const firebaseUser =
      await verifyFirebaseToken(
        idToken
      );


    const uid =
      firebaseUser.localId;


    // ==========================================
    // SERVICE ACCOUNT
    // ==========================================

    const secret =
      context.env.FIREBASE_SERVICE_ACCOUNT;


    if (!secret) {

      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT is missing."
      );

    }


    const serviceAccount =
      JSON.parse(secret);


    if (
      serviceAccount.project_id !==
      PROJECT_ID
    ) {

      throw new Error(
        "Wrong Firebase project."
      );

    }


    // ==========================================
    // SERVER ACCESS TOKEN
    // ==========================================

    const accessToken =
      await createAccessToken(
        serviceAccount
      );


    // ==========================================
    // LOAD USER
    // ==========================================

    const userDocument =
      await getUser(
        accessToken,
        uid
      );


    if (!userDocument) {

      return json(
        {
          success:
            false,

          message:
            "User profile not found."
        },

        404
      );

    }


    const fields =
      userDocument.fields || {};


    const lastReward =
      fields.lastLoginReward?.stringValue ||
      "";


    let rewardDay =
      Number(
        fields.loginRewardDay?.integerValue ||
        1
      );


    if (
      rewardDay < 1 ||
      rewardDay > 7
    ) {

      rewardDay = 1;

    }


    const today =
      getToday();


    // ==========================================
    // DUPLICATE CLAIM PROTECTION
    // ==========================================

    if (
      lastReward === today
    ) {

      return json(

        {

          success:
            false,

          alreadyClaimed:
            true,

          message:
            "You already claimed today's reward."

        },

        409

      );

    }


    // ==========================================
    // CALCULATE REWARD
    // ==========================================

    const reward =
      REWARDS[
        rewardDay - 1
      ];


    const nextDay =
      rewardDay === 7
        ? 1
        : rewardDay + 1;


    // ==========================================
    // ATOMIC UPDATE + HISTORY
    // ==========================================

    const result =
      await updateReward(

        accessToken,

        uid,

        userDocument,

        reward,

        today,

        nextDay,

        rewardDay

      );


    if (!result.success) {

      return json(

        {

          success:
            false,

          message:
            "Reward could not be processed. The account may have changed. Please try again."

        },

        409

      );

    }


    // ==========================================
    // SUCCESS
    // ==========================================

    return json(

      {

        success:
          true,

        reward:
          reward,

        day:
          rewardDay,

        nextDay:
          nextDay,

        pointsBefore:
          result.pointsBefore,

        pointsAfter:
          result.pointsAfter,

        transactionId:
          result.transactionId,

        message:
          `Reward claimed successfully. +${reward} Points`

      }

    );


  } catch (error) {

    console.error(
      "REWARD CLAIM ERROR:",
      error
    );


    return json(

      {

        success:
          false,

        message:
          "Server error while processing reward."

      },

      500

    );

  }

}
