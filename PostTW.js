Events = new Mongo.Collection("events");
//Attendees = Meteor.users;

if (Meteor.isServer){
	Meteor.publish ("directory", function(){
		return Meteor.users.find({});
	});
	Meteor.publish ("Events", function(){
		return Events.find({});
	});

  Meteor.publish("myEvents", function(){
    return Meteor.users.find({_id:Meteor.user()}, 
      {fields: {'eventList':1}});
  });

  Meteor.publish("participant", function(){ });

  Accounts.onCreateUser(function(options, user){
    user.type = "Attendee";
    user.eventList = [];
    return user;
  });
}


if (Meteor.isClient) {

	Meteor.subscribe("directory");
	Meteor.subscribe("Events");
  Meteor.subscribe("myEvents");

  Meteor.startup(function(){
    Session.setDefault("templateName", "schedule");
  });

  Template.body.helpers({
    
    templateName: function(){
      return Session.get("templateName");
    },
  	directory: function() {
  		return Meteor.users.find({});
  		//return Meteor.user().profile.username;
  	},
    myEvents: function() {
      //Meteor.subscribe("personalEvents");
      var user = Meteor.user();
      return Events.find({_id: {$in: user.eventList}}).fetch();
    }
  });

  Template.header.helpers({
    page: function(){
      if (Session.get("templateName") == "details") {
          return "Connect >"
        }else{
          return "< Add"
        }
    }
  })

  Template.header.events({
    "click .pageSwitch": function(){
        if (Session.get("templateName") == "details") {
          Session.set("templateName", "schedule");
        }else{
          Session.set("templateName", "details");
        }
      }
  });

  Template.details.helpers({
    events: function() {
      return Events.find({});
    },
  });

  Template.details.events({
    "click .details": function(event) {
      //var type = $('input[name="type"]:checked', event.target.type.value)
      event.preventDefault();
      var typeSet = event.currentTarget.typeSel.value;
      console.log(typeSet);
      Meteor.call("changeType", typeSet);
    }
  });

  Template.eventAdd.events({
    "click .eventAdd": function() {
      Meteor.call("eventAdd", this._id);
    }
  });

  Template.schedule.helpers({
    myEvents: function() {
      //Meteor.subscribe("personalEvents");
      var user = Meteor.user();
      return Events.find({_id: {$in: user.eventList}}).fetch();
    }
  });

  Template.eventShow.helpers({
    participant: function() {
      eventId = this._id;
      return Meteor.users.find({eventList: eventId }).fetch();
      console.log(Meteor.users.find({eventList: eventId }).fetch())
    }
  });

  Template.eventShow.events({
    "click .eventShow": function(){
      var divId = 'ObjectID("'+this._id+'")participants';
      $("#eventName").css('display', 'none');
      //$("."+divId).css('display', 'none');
      console.log(divId);
    }
  })

  Template.user.helpers({});

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
  },
})