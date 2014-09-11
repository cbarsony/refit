"use strict";

var day = React.createClass({
	displayName: "day",
	add: function(){
		this.props.addDay(this.props.day.id);
	},
	update: function(){
		this.props.updateDay(this.props.day);
	},
	remove: function(){
		this.props.removeDay(this.props.day.id);
	},
	render: function(){
		var links;
		if(this.props.day.comment){
			links = React.DOM.span(
				null,
				React.DOM.a({ href: "#", onClick: this.update }, "update"),
				React.DOM.a({ href: "#", onClick: this.remove }, "remove")
			);
		}
		else{
			links = React.DOM.a({ href: "#", onClick: this.add }, "add");
		}
		return React.DOM.div(
			null,
			this.props.day.id + ": " + this.props.day.comment + " ",
			links
		);
	}
});

var calendar = React.createClass({
	displayName: "calendar",
	dayAdded: function(id){
		var comment = prompt("Your comment: ");
		if(!comment) return;
		var day = _.find(this.state.days, function(day){
			return day.id === id;
		});
		day.comment = comment;
		this.setState({
			days: this.state.days
		});
	},
	dayUpdated: function(originalDay){
		var comment = prompt("Your comment: ", originalDay.comment);
		if(!comment) return;
		var dayToModify = _.find(this.state.days, function(day){
			return day.id === originalDay.id;
		});
		dayToModify.comment = comment;
		this.setState({
			days: this.state.days
		});
	},
	dayRemoved: function(id){
		var day = _.find(this.state.days, function(day){
			return day.id === id;
		});
		day.comment = "";
		this.setState({
			days: this.state.days
		});
	},
	getInitialState: function(){
		var self = this;
		daysRef.once("value", function(data){
			var x = data.val();
			self.setState({
				days: data.val()
			});
		});
		return {
			days: []
		};
	},
	render: function(){
		var calendarDays = [];
		for(var i = 0, l = this.props.daysNumber; i < l; i++){
			calendarDays.push(day({ day: { id: i, comment: "comment " + i } }));
		}
		return React.DOM.div(
			{ className: "calendar" },
			React.DOM.div(null, calendarDays)
		);
	}
});

var page = React.createClass({
	displayName: "page",
	selectChanged: function(e){
		this.setState({
			daysNumber: e.target.value
		});
	},
	getInitialState: function(){
		return {
			daysNumber: 4
		};
	},
	render: function(){
		return React.DOM.div(
			null,
			React.DOM.select(
				{ onChange: this.selectChanged },
				React.DOM.option({ value: "4" }, "4"),
				React.DOM.option({ value: "5" }, "5"),
				React.DOM.option({ value: "6" }, "6")
			),
			calendar({ daysNumber: this.state.daysNumber })
		)
	}
});

var daysRef = new Firebase("https://shining-torch-1499.firebaseio.com/react/days");
var daysNumber = 5;

/*var days = [
	{ id: 1, comment: "this is day 1" },
	{ id: 2, comment: "" },
	{ id: 3, comment: "" },
	{ id: 4, comment: "and this is day 4" },
	{ id: 5, comment: "" }
];*/

React.renderComponent(page(), document.body);
