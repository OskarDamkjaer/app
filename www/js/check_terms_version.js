function checkTermsVersion (termsVersion) {
//Prompts the user to accept the GDPR terms
  if ($.auth.user.terms_version!=termsVersion) {
      var popup = app.popup.create({
        content: `<div class="popup popup-terms">
                    <div class="block">
                      <div class="popup-text">GDPR 
                        <a class="link popup-open" href="https://id.wikipedia.org/wiki/Regulasi_Umum_Perlindungan_Data">länk till wikipedia</a>
                        <p><a class="link GDPRaccept" href="#">Jag accepterar</a></p>
                   </div>
                </div>
              </div>`,
            });popup.open();
      //Changes user data to make sure they only have to accept GDPR once
      $('.GDPRaccept').on('click', function () {
       $.ajax({
        type: 'PUT',
        dataType: 'json',
        url: API + '/users/' + $.auth.user.id,
        data: {user: {
          terms_version: termsVersion
        }}
      })
        .done(function() {
         console.log("Terms_version sparades som" + termsVersion)
         $.auth.user.terms_version = termsVersion
         popup.destroy();
        })
        .fail(function() {
          console.log("Terms_version ändrades inte")

        });
   });
}






}
