API_URL = "https://wolfinabox.herokuapp.com/mhw_horn_generator/api/v1"

$(document).ready(function () {
    $('#submit_button').prop('disabled', true);
    $('#effect_selector').prop('disabled', true);
    $('#submit_button').on('click', function () {
        let effects = $('#effect_selector').val()
        let horns_req = $.get(API_URL + '/get_horns_from_effects', { 'melodies': JSON.stringify(effects) })
        horns_req.done(function (data) {
            $('#horns_div').empty()
            let horns = data['response']['horns']
            for (let key in horns) {
                //name and link
                let id_name=horns[key]['name'].replace(' ','_');
                let horn_div=$('<div id="'+id_name+'"></div>').appendTo('#horns_div')
                id_name='#'+id_name;
                horn_div.append('<p><a href=' + horns[key]['horn_link'] + '>' + horns[key]['name'] + '</a></p>')
                //notes
                for (let index = 0; index < horns[key]['notes'].length; index++) {
                    horn_div.append('<img class="note_icon" src="' + data['response']['note_icon_url'].replace('{0}', horns[key]['notes'][index]) + '">')
                }


                //get effects for the horn
                horn_div.append('<ul>')
                $.get(API_URL + '/get_effects_from_horn', { 'horn': JSON.stringify(horns[key]['name']) }).done(function (data2) {
                    let horn_effects=data2['response']['effects'];
                    horn_effects.forEach(function(effect){
                        horn_div.append('<li>' + ((effect.hasOwnProperty('effect_urls'))?('<a href='+effect['effect_urls'][0]+'>'+effect['name']+'</a>'):(effect['name']))+'</li>');
                    });
                    
                    horn_div.append('</ul>')
                    //$('#horns_div').append('<br>');
                });




            }
        });
    })

    //get list of effects from the api (also functions as a "ping" test)
    let effects_req = $.get(API_URL + '/get_melody_list')
    effects_req.done(function (data) {
        $('#effect_selector').empty()
        for (let effect in data['response']['melodies']) {
            $('#effect_selector').append("<option>" + effect + "</option>")

        }
        $('#submit_button').prop('disabled', false);
        $('#effect_selector').prop('disabled', false);

    });

});