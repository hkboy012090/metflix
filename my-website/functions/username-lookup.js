// METFLIX - Secure Username Lookup
// Used only to find the email belonging to a username.
// The service-account private key is stored in Cloudflare Secrets.

const PROJECT_ID = "metflix-e8145";

const FIRESTORE_BASE =
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const TOKEN_URL =
  "https://oauth2.googleapis.com/token";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

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
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(
      value.length + (4 - value.length % 4) % 4,
      "="
    );

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

async function createAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  const claim = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600
  };

  const encodedHeader = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify(header)
    )
  );

  const encodedClaim = base64UrlEncode(
    new TextEncoder().encode(
      JSON.stringify(claim)
    )
  );

  const unsignedToken =
    `${encodedHeader}.${encodedClaim}`;

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
      .replace(/\s/g, "");

  const privateKey =
    await crypto.subtle.importKey(
      "pkcs8",
      base64UrlDecode(privateKeyBase64),
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: "SHA-256"
      },
      false,
      ["sign"]
    );

  const signature =
    await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5"
      },
      privateKey,
      new TextEncoder().encode(
        unsignedToken
      )
    );

  const assertion =
    `${unsignedToken}.${base64UrlEncode(
      new Uint8Array(signature)
    )}`;

  const response =
    await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type:
          "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion
      })
    });

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

async function findUsername(
  accessToken,
  username
) {
  const encodedUsername =
    encodeURIComponent(username);

  const url =
    `${FIRESTORE_BASE}/users` +
    `?mask.fieldPaths=email` +
    `&mask.fieldPaths=username` +
    `&orderBy=username` +
    `&pageSize=1`;

  // Firestore REST structured query
  const response =
    await fetch(
      `${FIRESTORE_BASE}:runQuery`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          structuredQuery: {
            from: [
              {
                collectionId: "users"
              }
            ],
            where: {
              fieldFilter: {
                field: {
                  fieldPath: "username"
                },
                op: "EQUAL",
                value: {
                  stringValue: username
                }
              }
            },
            limit: 1
          }
        })
      }
    );

  if (!response.ok) {
    console.error(
      "FIRESTORE USERNAME SEARCH ERROR:",
      await response.text()
    );

    throw new Error(
      "Unable to search username."
    );
  }

  const results =
    await response.json();

  if (
    !Array.isArray(results) ||
    !results.length ||
    !results[0].document
  ) {
    return null;
  }

  const fields =
    results[0].document.fields || {};

  return {
    username:
      fields.username?.stringValue || "",

    email:
      fields.email?.stringValue || ""
  };
}

export async function onRequest(context) {

  if (
    context.request.method !== "POST"
  ) {
    return json(
      {
        success: false,
        message: "POST method required."
      },
      405
    );
  }

  try {

    const body =
      await context.request.json();

    const username =
      String(
        body.username || ""
      ).trim();

    if (!username) {
      return json(
        {
          success: false,
          message: "Username is required."
        },
        400
      );
    }

    if (username.length > 50) {
      return json(
        {
          success: false,
          message: "Invalid username."
        },
        400
      );
    }

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

    const accessToken =
      await createAccessToken(
        serviceAccount
      );

    const user =
      await findUsername(
        accessToken,
        username
      );

    if (!user) {
      return json(
        {
          success: false,
          found: false,
          message: "Username not found."
        },
        404
      );
    }

    return json({
      success: true,
      found: true,
      email: user.email
    });

  } catch (error) {

    console.error(
      "USERNAME LOOKUP ERROR:",
      error
    );

    return json(
      {
        success: false,
        message:
          "Unable to process username lookup."
      },
      500
    );
  }
}
