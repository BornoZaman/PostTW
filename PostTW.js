Events = new Mongo.Collection("events");
//Attendees = Meteor.users;

if (Meteor.isServer){
	Meteor.publish ("directory", function(){
		return Meteor.users.find({});
	});
	Meteor.publish ("Events", function(){
		return Events.find({});
	});

  Accounts.onCreateUser(function(options, user){
    user.type = "Attendee";
    user.eventList = [];
    return user;
  });
}

if (Meteor.isClient) {

	Meteor.subscribe("directory");
	Meteor.subscribe("Events");
  // This code only runs on the client

  Template.body.helpers({
  	directory: function() {
  		return Meteor.users.find({});
  		//return Meteor.user().profile.username;
  	},
    
    events: function() {
      return Events.find({});
    }
  });

  Template.event.events({
    "click .eventAdd": function() {
      Meteor.call("eventAdd", this._id);
      
    },

  });

  Template.user.helpers({});

  Template.details.helpers({});

  Template.details.events({
    "click .details": function(event) {
      //var type = $('input[name="type"]:checked', event.target.type.value)
      event.preventDefault();
      var typeSet = event.currentTarget.typeSel.value;
      console.log(typeSet);
      Meteor.call("changeType", typeSet);
      
    }

    /*
    "click .type": function(event) {
      //var type = $('input[name="type"]:checked', event.target.type.value)
      event.preventDefault();
      var typeSet = event.target.type.value;
      Meteor.call("changeType", typeSet);
      console.log(typeSet);
    }*/
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

Meteor.methods({

  changeType: function(typeSet){
    Meteor.users.update({_id:Meteor.user()._id}, {
      $set: {type : typeSet}
    });
  },

  eventAdd: function(eventId){
    console.log(eventId);
    Meteor.users.update({_id:Meteor.user()._id}, {
      $addToSet: {eventList: eventId}
    })
  }

})