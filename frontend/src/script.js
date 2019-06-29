// Form Submit

$('#signUpForm').submit(function(event) {
  var values = {};
  $.each($('#signUpForm').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  console.log('values');

  event.preventDefault();
  return false;
});
