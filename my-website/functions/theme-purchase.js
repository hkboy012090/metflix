// METFLIX - Secure Theme Purchase
// Points Redemption System

const PROJECT_ID = "metflix-e8145";

const FIREBASE_API_KEY =
  "AIzaSyCprwxcwbJm5Qu-IjVQxKxBuseakVu16dY";

const TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;


// ============================================
// AVAILABLE THEMES
// ============================================

const THEMES = {

  "classic-red": {
    price: 0
  },

  "neon-purple": {
    price: 300
  },

  "cyber-blue": {
    price: 300
  },

  "galaxy": {
    price: 500
  },

  "gold-vip": {
    price: 1000
  }

};


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

            idToken:
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
// PURCHASE THEME
// ============================================

async function purchaseTheme(
  accessToken,
  uid,
  userDocument,
  themeId,
  price
) {

  const existingFields =
    userDocument.fields || {};


  // ------------------------------------------
  // CURRENT POINTS
  // ------------------------------------------

  const currentPoints =
    Number(

      existingFields.points?.integerValue ||

      existingFields.points?.doubleValue ||

      0

    );


  // ------------------------------------------
  // OWNED THEMES
  // ------------------------------------------

  let ownedThemes = [];


  const storedThemes =
    existingFields
      .ownedThemes
      ?.arrayValue
      ?.values;


  if (
    Array.isArray(
      storedThemes
    )
  ) {

    ownedThemes =
      storedThemes
        .map(
          item =>
            item.stringValue
        )
        .filter(Boolean);

  }


  // ------------------------------------------
  // CHECK ALREADY OWNED
  // ------------------------------------------

  if (
    ownedThemes.includes(
      themeId
    )
  ) {

    return {

      success: false,

      alreadyOwned: true,

      message:
        "You already own this theme."

    };

  }


  // ------------------------------------------
  // CHECK POINTS
  // ------------------------------------------

  if (
    currentPoints < price
  ) {

    return {

      success: false,

      insufficientPoints: true,

      currentPoints:
        currentPoints,

      requiredPoints:
        price,

      message:
        `You need ${price} points to unlock this theme.`

    };

  }


  // ------------------------------------------
  // CALCULATE NEW POINTS
  // ------------------------------------------

  const newPoints =
    currentPoints - price;


  // ------------------------------------------
  // ADD THEME
  // ------------------------------------------

  ownedThemes.push(
    themeId
  );


  // ------------------------------------------
  // FIRESTORE ARRAY
  // ------------------------------------------

  const themeValues =
    ownedThemes.map(
      theme => ({
        stringValue:
          theme
      })
    );


  // ------------------------------------------
  // DOCUMENT NAME
  // ------------------------------------------

  const documentName =
    `projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;


  // ------------------------------------------
  // PRESERVE USER DATA
  // ------------------------------------------

  const newFields = {

    ...existingFields,


    points: {

      integerValue:
        String(newPoints)

    },


    ownedThemes: {

      arrayValue: {

        values:
          themeValues

      }

    }

  };


  // ------------------------------------------
  // FIRESTORE WRITE
  // ------------------------------------------

  const write = {

    update: {

      name:
        documentName,

      fields:
        newFields

    },

    currentDocument: {

      updateTime:
        userDocument.updateTime

    }

  };


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
              write
            ]

          })

      }

    );


  if (!response.ok) {

    console.error(
      "THEME PURCHASE ERROR:",
      await response.text()
    );

    return {

      success: false,

      message:
        "Theme purchase could not be completed."

    };

  }


  return {

    success: true,

    theme:
      themeId,

    price:
      price,

    previousPoints:
      currentPoints,

    remainingPoints:
      newPoints,

    ownedThemes:
      ownedThemes

  };

}


// ============================================
// MAIN FUNCTION
// ============================================

export async function onRequest(
  context
) {

  // ------------------------------------------
  // METHOD
  // ------------------------------------------

  if (
    context.request.method !== "POST"
  ) {

    return json(

      {

        success: false,

        message:
          "POST method required."

      },

      405

    );

  }


  try {

    // ----------------------------------------
    // AUTHORIZATION
    // ----------------------------------------

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

          success: false,

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


    // ----------------------------------------
    // VERIFY FIREBASE USER
    // ----------------------------------------

    const firebaseUser =
      await verifyFirebaseToken(
        idToken
      );


    const uid =
      firebaseUser.localId;


    // ----------------------------------------
    // READ REQUEST
    // ----------------------------------------

    const body =
      await context.request.json();


    const themeId =
      String(
        body.themeId || ""
      ).trim();


    if (!themeId) {

      return json(

        {

          success: false,

          message:
            "Theme is required."

        },

        400

      );

    }


    // ----------------------------------------
    // VALIDATE THEME
    // ----------------------------------------

    const theme =
      THEMES[themeId];


    if (!theme) {

      return json(

        {

          success: false,

          message:
            "Invalid theme."

        },

        400

      );

    }


    const price =
      Number(
        theme.price
      );


    // ----------------------------------------
    // SERVICE ACCOUNT
    // ----------------------------------------

    const secret =
      context.env
        .FIREBASE_SERVICE_ACCOUNT;


    if (!secret) {

      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT is missing."
      );

    }


    const serviceAccount =
      JSON.parse(
        secret
      );


    if (
      serviceAccount.project_id !==
      PROJECT_ID
    ) {

      throw new Error(
        "Wrong Firebase project."
      );

    }


    // ----------------------------------------
    // SERVER ACCESS TOKEN
    // ----------------------------------------

    const accessToken =
      await createAccessToken(
        serviceAccount
      );


    // ----------------------------------------
    // LOAD USER
    // ----------------------------------------

    const userDocument =
      await getUser(
        accessToken,
        uid
      );


    if (!userDocument) {

      return json(

        {

          success: false,

          message:
            "User profile not found."

        },

        404

      );

    }


    // ----------------------------------------
    // PURCHASE
    // ----------------------------------------

    const result =
      await purchaseTheme(

        accessToken,

        uid,

        userDocument,

        themeId,

        price

      );


    // ----------------------------------------
    // ALREADY OWNED
    // ----------------------------------------

    if (
      result.alreadyOwned
    ) {

      return json(

        result,

        409

      );

    }


    // ----------------------------------------
    // INSUFFICIENT POINTS
    // ----------------------------------------

    if (
      result.insufficientPoints
    ) {

      return json(

        result,

        400

      );

    }


    // ----------------------------------------
    // FAILED
    // ----------------------------------------

    if (
      !result.success
    ) {

      return json(

        result,

        409

      );

    }


    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------

    return json({

      success: true,

      message:
        "Theme unlocked successfully.",

      theme:
        result.theme,

      spentPoints:
        result.price,

      remainingPoints:
        result.remainingPoints,

      ownedThemes:
        result.ownedThemes

    });


  } catch (error) {

    console.error(
      "THEME PURCHASE ERROR:",
      error
    );


    return json(

      {

        success: false,

        message:
          "Server error while processing theme purchase."

      },

      500

    );

  }

}
