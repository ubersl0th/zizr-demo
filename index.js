const neo4j = require("neo4j-driver");
const { nanoid } = require("nanoid");

console.log(nanoid(4));

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
        "CREATE CONSTRAINT IF NOT EXISTS ON (p:Person) ASSERT p.id IS UNIQUE"
      );
      tx.run(
        "CREATE CONSTRAINT IF NOT EXISTS ON (p:Product) ASSERT p.id IS UNIQUE"
      );
    });

    // create som users
    await session.writeTransaction((tx) => {
      // for (let index = 0; index < 15; index++) {
      //   tx.run(`CREATE (:Person {id: "${nanoid(4)}"})`);
      // }
      tx.run(`CREATE 	(:Person {id: "a4dz"}),
                      (:Person {id: "f72m"}),
                      (:Person {id: "o4d1"}),
                      (:Person {id: "gz3c"}),
                      (:Person {id: "b32w"})`);
    });

    // PRODUCTS HERE
    await session.writeTransaction((tx) => {
      tx.run(`LOAD CSV FROM 'C:\\Users\\eivin\\code\\Zizr SVT Demo\\test.csv' AS line
            CREATE (:Artist { name: line[1], year: toInteger(line[2])})`);
    });

    // create relations
    await session.writeTransaction((tx) => {
      tx.run("MATCH (n) DETACH DELETE n");
    });
  } catch (e) {
    console.log(e);
  } finally {
    await session.close();
  }

  // close driver
  await driver.close();
})();
