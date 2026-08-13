// ayeT callback endpoint
export async function onRequest(context) {

  console.log("ayeT callback received");

  return new Response(
    JSON.stringify({
      success: true,
      message: "ayeT callback received"
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

}
