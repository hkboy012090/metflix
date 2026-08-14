async function updateReward(
  accessToken,
  uid,
  userDocument,
  reward,
  today,
  nextDay
) {

  const existingFields =
    userDocument.fields || {};

  const currentPoints =
    Number(
      existingFields.points?.integerValue ||
      existingFields.points?.doubleValue ||
      0
    );

  const newPoints =
    currentPoints + reward;

  const documentName =
    `projects/${PROJECT_ID}/databases/(default)/documents/users/${uid}`;

  // PRESERVE ALL EXISTING USER DATA
  const newFields = {
    ...existingFields,

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
  };

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
      "FIRESTORE UPDATE ERROR:",
      await response.text()
    );

    return false;

  }

  return true;

}
