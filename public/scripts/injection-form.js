$(document).ready(function () {
  $('#skills').select2({ tags: true })
  //keep track of dynamically generated education and experience
  var eduCount = 0
  var expCount = 0

  //process to dynamically create education information
  $('#addEducation').on('click', function (e) {
    e.preventDefault()
    if ($('#institution_' + eduCount).length === 0) {
      $('#educationSection').append(
        `
        <div class="col-12 mb-3">
          <label for="institution">Institution: </label>
          <input type="text" class="form-control input-lg input-style" name="institution" id="institution_` +
          eduCount +
          `" placeholder="Institution Name...">
        </div>
        <div class="col-4 mb-3">
          <label for="achieved">Degree</label>
          <input type="text" class="form-control input-lg input-style" name="achieved" id="achieved_` +
          eduCount +
          `" placeholder="AS, BS, MS, PHD etc...">
        </div>
        <div class="col-4 mb-3">
          <label for="program">Program</label>
          <input type="text" class="form-control input-lg input-style" name="program" id="program_` +
          eduCount +
          `" placeholder="Program Name...">
        </div>
        <div class="col-4 mb-3">
          <label for="gradYear">Grad Year</label>
          <input type="number" min="1900" max="2099" step="1" class="form-control input-lg input-style" name="gradYear" id="gradYear_` +
          eduCount +
          `" placeholder="Graduation Year..."/>
        </div>
        <div class="col-3 mb-3">
          <label for="graduated">Graduated</label>
          <select name="graduated" id="graduated_` +
          eduCount +
          `" class="form-control input-style input-lg">
            <option value="" disabled selected>Select One</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div class="col-6 mb-3">
          <label for="city">City</label>
          <input type="text" class="form-control input-lg input-style" name="city" id="city_` +
          eduCount +
          `">
        </div>
        <div class="col-3 mb-3">
          <label for="state">State</label>
          <select name="state" id="state_` +
          eduCount +
          `" class="form-control input-style input-lg">
            <option value="" disabled selected>Select State</option>
            <option value="">Test</option>
          </select>
        </div>
      `
      )
      /**
       * make an ajax request to this app's custom api to fetch db data
       * create an ejs snipped and append it where needed
       */
      $('#educationSection').ready(() => {
        $.ajax({
          url: '/query/get-states',
          success: function (result) {
            //result comes as an array of documents
            states = JSON.parse(result)

            //render ejs into html and store it in 'html'
            statesOptionsHtml = ejs.render(
              `<% states.forEach(state => { %>
              <option value="<%= state.stateCode %> "><%= state.stateDesc %> </option>
            <% }) %>`,
              { states: states }
            )

            //append html to #states_ through DOM
            console.log(statesOptionsHtml)
            //! not appending? tries to append before the new html form snippet is fully added
            // $(`#state_` + eduCount).html(statesOptionsHtml)
            document.getElementById(
              `state_` + eduCount
            ).innerHTML = statesOptionsHtml
          },
        })
      })

      eduCount++
    }
  })

  //process to dynamically create experience information
  $('#addExperience').on('click', function (e) {
    e.preventDefault()
    if ($('#expName_' + expCount).length == 0) {
      $('#experienceSection').append(
        `
        <div class="col-12 mb-3">
          <label for="expName">Experience Name: </label>
          <input type="text" class="form-control input-lg input-style" name="expName" id="expName_` +
          expCount +
          `" placeholder="Exprience Name...">
        </div>
        <div class="col-4 mb-3">
          <label for="title">Title: </label>
          <input type="text" class="form-control input-lg input-style" name="title" id="title_` +
          expCount +
          `" placeholder="Title...">
        </div>
        <div class="col-2 mb-3">
          <label for="fromMonth">From Month:</label>
          <select name="fromMonth" id="fromMonth_` +
          expCount +
          `" class="form-control input-style input-lg">
            <option value="" disabled selected>Select Month</option>
            <% months.forEach(month => { %>
              <option value="<%= month.monthCode %> "><%= month.monthDesc %> </option>
            <% }) %>
          </select>
        </div>
        <div class="col-2 mb-3">
          <label for="fromYear">From Year</label>
          <input type="number" min="1900" max="2099" step="1" class="form-control input-lg input-style" name="fromYear" id="fromYear_` +
          eduCount +
          `" placeholder="From Year..."/>
        </div>
        <div class="col-2 mb-3">
          <label for="toMonth">To Month:</label>
          <select name="toMonth" id="toMonth_` +
          expCount +
          `" class="form-control input-style input-lg">
            <option value="" disabled selected>Select Month</option>
            <% months.forEach(month => { %>
              <option value="<%= month.monthCode %> "><%= month.monthDesc %> </option>
            <% }) %>
          </select>
        </div>
        <div class="col-2 mb-3">
          <label for="toYear">to Year</label>
          <input type="number" min="1900" max="2099" step="1" class="form-control input-lg input-style" name="toYear" id="toYear_` +
          eduCount +
          `" placeholder="to Year..."/>
        </div>
        <div class="col-6 mb-3">
          <label for="expCity">City</label>
          <input type="text" class="form-control input-lg input-style" name="expCity" id="expCity_` +
          expCount +
          `">
        </div>
        <div class="col-3 mb-3">
          <label for="expState">State</label>
          <select name="expState" id="expState_` +
          expCount +
          `" class="form-control input-style input-lg">
            <option value="" disabled selected>Select State</option>
            <% states.forEach(state => { %>
              <option value="<%= state.stateCode %> "><%= state.stateDesc %> </option>
            <% }) %>
          </select>
        </div>
        <div class="col-12 mb-3">
          <label for="description">Description:</label></label>
          <textarea
            class="form-control input-sm input-style"
            type="text"
            name="description"
            id="description_` +
          expCount +
          `"
            placeholder="Description...."
            rows="5"
            required
          ></textarea>
        </div>
        <div class="col-12 mb-3">
          <label for="jobDuties">Job Duties:</label></label>
          <textarea
            class="form-control input-sm input-style"
            type="text"
            name="jobDuties"
            id="jobDuties_` +
          expCount +
          `"
            placeholder="Job Duties...."
            rows="5"
            required
          ></textarea>
        </div>
      `
      )
      expCount++
    }
  })
})
