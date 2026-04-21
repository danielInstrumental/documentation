// const privateAppKey = "pat-na1-...";

const getContacts = async () => {
  try {
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&properties=firstname,lastname,email",
      {
        headers: {
          Authorization: `Bearer ${privateAppKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status} — ${errorText}`);
    }

    const data = await response.json();
    console.log("Contacts:", data);

    return data;
  } catch (error) {
    console.error("Error fetching contacts:", error.message);
  }
};

getContacts();