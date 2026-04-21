

// Example with Developers account

const tableIdOrName = "16215925";
// const privateAppKey = "pat-na1-94cbfbbf-1dc...";

const getHubDbRows = async () => {
  try {
    const response = await fetch(
      `https://api.hubapi.com/cms/v3/hubdb/tables/${tableIdOrName}/rows`,
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
    console.log("HubDB Rows:", data);

    return data;
  } catch (error) {
    console.error("Error fetching HubDB rows:", error.message);
  }
};

getHubDbRows();