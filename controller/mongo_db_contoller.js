const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://ashish:cqc2liwCjezbjzaf@cluster0.huzrl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  console.log("DB connected");
});

module.exports = client;