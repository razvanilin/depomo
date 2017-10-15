const mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = (app) => {

  Achievement = mongoose.model('achievement', app.models.achievement);

  Achievement.find({}, (err, docs) => {
    if (err) return;

    if (docs && docs.length > 0) return;


    var comp1 = new ObjectId("597ad2e00000000000000000");
    var comp2 = new ObjectId("597ae0f00000000000000000");
    var comp3 = new ObjectId("597aef000000000000000000");
    var comp4 = new ObjectId("597afd100000000000000000");
    var comp5 = new ObjectId("597b0b200000000000000000");
    var comp6 = new ObjectId("597b19300000000000000000");

    var saved1 = new ObjectId("597b27400000000000000000");
    var saved2 = new ObjectId("597b35500000000000000000");
    var saved3 = new ObjectId("597b43600000000000000000");
    var saved4 = new ObjectId("597b51700000000000000000");
    var saved5 = new ObjectId("597b5f800000000000000000");

    var ben1 = new ObjectId("597b6d900000000000000000");
    var ben2 = new ObjectId("597b7ba00000000000000000");
    var ben3 = new ObjectId("597b89b00000000000000000");
    var ben4 = new ObjectId("597b97c00000000000000000");
    var ben5 = new ObjectId("597ba5d00000000000000000");
    var ben6 = new ObjectId("597bb3e00000000000000000");

    var achievements = [{
      // COMPLETIONIST
      _id: comp1,
      label: "Completionist",
      value: 1,
      description: "Completed your first task",
      nextLevel: comp2,
      imageFileName: "something.png",
      primary: true,
    }, {
      _id: comp2,
      label: "Completionist 10",
      value: 10,
      description: "Completed 10 tasks",
      nextLevel: comp3,
      imageFileName: "something.png",
    }, {
      _id: comp3,
      label: "Completionist 25",
      value: 25,
      description: "Completed 25 tasks",
      nextLevel: comp4,
      imageFileName: "something.png",
    }, {
      _id: comp4,
      label: "Completionist 50",
      value: 50,
      description: "Completed 50 tasks",
      nextLevel: comp5,
      imageFileName: "something.png",
    }, {
      _id: comp5,
      label: "Completionist 100",
      value: 100,
      description: "Completed 100 tasks",
      nextLevel: comp6,
      imageFileName: "something.png",
    }, {
      _id: comp6,
      label: "Completionist 500",
      value: 500,
      description: "Completed 500 tasks",
      imageFileName: "something.png",
    },
    // -----------------------------------------------

    // SAVIOUR
    {
      _id: saved1,
      label: "Saviour 50",
      value: 50,
      description: "Saved $50 worth of deposits",
      nextLevel: saved2,
      imageFileName: "something.png",
    }, {
      _id: saved2,
      label: "Saviour 100",
      value: 100,
      description: "Saved $100 worth of deposits",
      nextLevel: saved3,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: saved3,
      label: "Saviour 500",
      value: 500,
      description: "Saved $500 worth of deposits",
      nextLevel: saved4,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: saved4,
      label: "Saviour 1000",
      value: 1000,
      description: "Saved $1000 worth of deposits",
      nextLevel: saved5,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: saved5,
      label: "Saviour 5000",
      value: 5000,
      description: "Saved $5000 worth of deposits",
      imageFileName: "something.png",
      primary: false,
    },
    // -----------------------------------------------

    // BENEFACTOR
    {
      _id: ben1,
      label: "Benefactor 10",
      value: 10,
      description: "Donated $10 worth of deposits",
      nextLevel: ben2,
      imageFileName: "something.png",
    }, {
      _id: ben2,
      label: "Benefactor 25",
      value: 25,
      description: "Donated $25 worth of deposits",
      nextLevel: ben3,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: ben3,
      label: "Benefactor 50",
      value: 50,
      description: "Donated $50 worth of deposits",
      nextLevel: ben4,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: ben4,
      label: "Benefactor 100",
      value: 100,
      description: "Donated $100 worth of deposits",
      nextLevel: ben5,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: ben5,
      label: "Benefactor 250",
      value: 250,
      description: "Donated $250 worth of deposits",
      nextLevel: ben6,
      imageFileName: "something.png",
      primary: false,
    }, {
      _id: ben6,
      label: "Benefactor 500",
      value: 500,
      description: "Donated $500 worth of deposits",
      imageFileName: "something.png",
      primary: false,
    },
    // -----------------------------------------------

    // OTHERS
    {
      label: "Dreamer",
      description: "Failed a task",
      imageFileName: "something.png",
    }, {
      label: "Explorer",
      description: "Visited all the pages on the website",
      imageFileName: "something.png",
    }, {
      label: "Banker",
      description: "Added the first payment method",
      imageFileName: "something.png",
    }, {
      label: "Living on the edge",
      description: "Completed a task 1 minute before the deadline",
      imageFileName: "something.png",
    }, {
      label: "High stakes",
      description: "Placed a single deposit worth more than $100",
      imageFileName: "something.png",
    }, {
      label: "Connected",
      description: "Connected to the Google Calendar",
      imageFileName: "something.png",
    }, {
      label: "Technologist",
      description: "Created your first task using Google Calendar",
      imageFileName: "something.png",
    }];

    Achievement.create(achievements, err => {
      if (err) {
        console.log(err);
      } else {
        console.log("Done inserting achievements");
      }
    });
  });
}
