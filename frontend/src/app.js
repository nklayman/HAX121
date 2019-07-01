import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import "./style.css";

$("#signUpForm").submit(function(event) {
  event.preventDefault();

  var $inputs = $("#signUpForm :input");
  var values = {};
  $inputs.each(function() {
    if (this.name) {
      values[this.name] = $(this).val();
    }
  });

  var requestBody = {
    first_name: values.firstName,
    last_name: values.lastName,
    school: values.school,
    grade: values.grade,
    email: values.email,
    shirt_size: values.shirtSize,
    allergy: values.foodAllergies,
    diet_restriction: values.dietaryPref,
    experience: values.yearsExperience,
    first_time: values.firstTime === "yes",
    phone_number: values.phoneNumber
  };

  // Create Student
  $.ajax({
    type: "POST",
    url: "http://localhost:9121/api/students",
    data: requestBody,
    success: function(data, status, request) {
      console.log(data);

      // Create Emergency Contact
      var contact = {
        name: values.contactName,
        relation: values.contactRelation,
        phone_number: values.contactNumber,
        email: values.contactEmail,
        student_id: data.id
      };

      $.ajax({
        type: "POST",
        url: "http://localhost:9121/api/emergencycontacts",
        data: contact,
        success: function(data, status, request) {
          console.log(data);
          // TODO: Student registered, display message
        },
        error: function(request, status, error) {
          console.log(error);
          // TODO: Error when creating emergency contact, display error
        },
        dataType: "json"
      });
    },
    error: function(request, status, error) {
      console.log(error);
      // TODO: Error when creating student, display error
    },
    dataType: "json"
  });

  return false;
});
