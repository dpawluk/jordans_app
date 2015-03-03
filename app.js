(function() {
	
	'use strict';

	return {
		users: [],

		requests: {
			get_url: function(url) {
				return{
					url: url
				};
			},
			pop_ticket_for_agent: function(agent_id, ticket_id) {
				return {
					url: helpers.fmt("/api/v2/channels/voice/agents/%@/tickets/%@/display.json", agent_id, ticket_id),
					type: 'POST'
				};
			}
		},

		events: {
			'app.activated':'init',
			'click #pop_button': 'sendTicket'
		},

		init: function() {
			var data = this.get_all("/api/v2/users.json?role[]=agent&role[]=admin&per_page=20", 'users', [], _.bind(function(data){
				this.displayUI(data);
			}, this));
		},


    get_all: function(url, en, data, fn) {
        if(data === null) {
            data = [];
        }
        if(url === null) {
            fn(data);
        } else {
            this.ajax('get_url', url).done(function(newdata){
                data = data.concat(newdata[en]);
                this.get_all(newdata.next_page, en, data, fn);
            });
        }
    },

    displayUI: function(data) {
    	this.switchTo('main', {
				agents: data
			});
    },

    sendTicket: function(e) {
    	e.preventDefault();
    	var agent_id = this.$("#agent_select").val();
    	var ticket_id = this.ticket().id();
    	if(agent_id === "-") {
    		services.notify("you have to pick an agent dummy!", "error");
    	} else {
    		this.ajax('pop_ticket_for_agent', agent_id, ticket_id);
    	}
    }
	}; 

}());
