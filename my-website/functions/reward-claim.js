// ============================================
// METFLIX SECURE DAILY REWARD
// ============================================

export async function onRequestPost(context) {

  try {

    // ------------------------------------------
    // CHECK AUTHORIZATION HEADER
    // ------------------------------------------

    const authorization =
      context.request.headers.get("Authorization");

    if (!authorization) {

      return jsonResponse(
        {
          success: false,
          message: "Unauthorized."
        },
        401
      );

    }


    // ------------------------------------------
    // GET FIREBASE ID TOKEN
    // ------------------------------------------

    const token =
      authorization.replace("Bearer ", "").trim();


    if (!token) {

      return jsonResponse(
        {
          success: false,
          message: "Invalid authentication token."
        },
        401
      );

    }


    /*
     * IMPORTANT
     *
     * We will verify this Firebase token
     * server-side.
     *
     * The Firebase Admin configuration will
     * be added after this endpoint is created.
     */


    // ------------------------------------------
    // TEMPORARY RESPONSE
    // ------------------------------------------

    return jsonResponse(
      {
        success: false,
        message:
          "Reward server is ready for Firebase verification."
      },
      501
    );


  } catch (error) {

    console.error(
      "REWARD CLAIM ERROR:",
      error
    );


    return jsonResponse(
      {
        success: false,
        message: "Internal server error."
      },
      500
    );

  }

}


// ============================================
// JSON RESPONSE HELPER
// ============================================

function jsonResponse(data, status = 200) {

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

}
