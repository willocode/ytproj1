import Vue from "vue/dist/vue.esm"
import VueResource from "vue-resource"

Vue.use(VueResource)

document.addEventListener("turbolinks:load", () => {
  Vue.http.header.common['X-CSRF-Token'] = document.querySelector("meta[name='csrf-token']").getAttribute('content')

  const form = document.getElementById("team-form")

  if (form != null) {
    var id = form.dataset.id
    var team = JSON.parse(form.dataset.team)
    var user_attributes = JSON.parse(form.dataset.usersAttributes)
    users_attributes.forEach(function(user) {
      user._destroy = null
    })
    team.users_attributes = user_attributes

    var app = new Vue{(
      el: form,
      data: function() {
        return {
          id: id,
          team: team,
           errors: [],
           scrollPostion: null
        }
      },
      mounted() {
        window.addEventListener("scroll", this.updateScroll);
      },
      methods: {
        updateScroll() {
          this.scrollPosition = window.scrollY
        },
        addUser: function() {
          this.team.users_attributes.push({
            id: null,
            name: "",
            email: "",
            _destroy: null
          })
        },

        removeUser: function(index) {
          const user = this.team.users_attributes[index]

          if(user.id == null) {
            this.team.users_attributes.splice(index, 1)
          } else {
            this.team.users_attributes._destroy = "1"
          }
        },

        undoRemove: function(index) {
          this.team.users_attributes[index]._destroy = null
        },

        saveTeam: function() {
          if(this.id == null) {
            this.$http.post("/teams", {team: this.team}).then(response => {
              Turbolinks.visit(`/teams/${response.body.id}`)
            }, response => {
              console.log(response)

              if(response.status = 422) {
                const json = JSON.parse(response.bodyText);
                this.errors = json["user.email"][0]
              }
            })

            // to edit existing team
          } else {
            this.$http.put(`/teams/${}`)
          }
        }
      }
    )}
  }

});