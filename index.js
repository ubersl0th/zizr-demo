const neo4j = require("neo4j-driver");

//IIF
(async function () {
  // create driver
  const driver = neo4j.driver(
    "neo4j://localhost",
    neo4j.auth.basic("neo4j", "zizr2021")
  );

  const serverInfo = await driver.verifyConnectivity();
  console.log(serverInfo);

  // start session
  const session = driver.session();

  try {
    // delete all
    await session.writeTransaction((tx) => {
      tx.run("MATCH (n) DETACH DELETE n");
    });

    // create contraints
    await session.writeTransaction((tx) => {
      tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS ON (u:User) ASSERT u.userId IS UNIQUE"
      );
      tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS ON (p:Product) ASSERT p.productId IS UNIQUE"
      );
    });

    // create som users
    await session.writeTransaction((tx) => {
      tx.run(`CREATE 	(:User {userId: "a4dz"}),
                      (:User {userId: "f72m"}),
                      (:User {userId: "o4d1"}),
                      (:User {userId: "gz3c"}),
                      (:User {userId: "hf0l"}),
                      (:User {userId: "p91t"}),
                      (:User {userId: "ab45"}),
                      (:User {userId: "9g9f"}),
                      (:User {userId: "5gau"}),
                      (:User {userId: "b32w"})`);
    });

    // create products from csv
    await session.writeTransaction((tx) =>
      tx.run(
        `LOAD CSV FROM 'https://raw.githubusercontent.com/ubersl0th/zizr-demo/main/products.csv' AS line
        CREATE (:Product { productId: line[0], model: line[1], category: line[2], size: line[3]})`
      )
    );

    // create relations from csv
    await session.writeTransaction((tx) =>
      tx.run(
        `LOAD CSV FROM 'https://raw.githubusercontent.com/ubersl0th/zizr-demo/main/relations.csv' AS line
        MATCH (u:User),(p:Product) WHERE u.userId = line[0] AND p.productId = line[1] CREATE (u)-[:OWNS]->(p)`
      )
    );
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
  }

  // close driver
  await driver.close();
})();
