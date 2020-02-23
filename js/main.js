const API_URL = "https://wolfinabox.herokuapp.com/mhw_horn_generator/api/v1/"
//const API_URL = "http://127.0.0.1:5000/mhw_horn_generator/api/v1/"
function sort_horns(horns, field) {
    field = field.toLowerCase()
    if (field == 'Alphabetical' || !(field in horns[0]))
        return horns;

    return horns.sort((a, b) => (parseInt(a[field]) < parseInt(b[field])) ? 1 : ((parseInt(a[field]) > parseInt(b[field])) ? -1 : 0))
}

function display_horns(data,effects) {
    if (!data) return;
    let horns = data['response']['horns']
    $('#horns_amt').text('Horns: ' + horns.length)
    $('#horns_div').empty()

    for (const horn of sort_horns(horns, $('#sort_selector').val())) {
        //name and link
        let notes = horn['notes'].split('-')
        //collapsable button header
        let horn_header = $('<button type="button" class="collapsible horn_header"></button>').appendTo($('#horns_div'));
        horn_header.append('<p class="horn_name">' + horn['name'] + '</p>')

        for (const note of notes) {
            horn_header.append('<img class="note_img" src="' + data['response']['note_img_urls'][note] + '" height=25px>')
        }

        //info content
        let horn_div = $('<div class="content horn_content"></div>').appendTo($('#horns_div'));
        //create content
        horn_div.append('<button type="button" class="collapsible effects_header">Effects</button>');
        let effects_div = $('<div class="content effects_content></div>').appendTo(horn_div);

        //request effects
        // $.get(API_URL + '/get_effects_from_horn', { 'horn': JSON.stringify(horn['name']) }).done(function (effects_data) {
        //     for (const effect of effects_data['response']['effects']) {
        //         effects_div.append('<li><p>' + effect['effects'][0] + '</p></li>')
        //     }
        // });


        horn_div.append('<li><h3><a href="' + horn['horn_url'] + '">Wiki Link</a></h3></li>')
        horn_div.append('<li><h3>Tree:</h3><p> ' + horn['tree'] + '</h></li>')
        horn_div.append('<li><h3>Attack:</h3><p> ' + horn['attack'] + '</p></li>')
        horn_div.append('<li><h3>Affinity:</h3><p> ' + horn['affinity'] + '</p></li>')
        horn_div.append('<li><h3>Element:</h3><p> ' + horn['element'] + '</p></li>')
        horn_div.append('<li><h3>Sharpness:</h3><p> ' + horn['sharpness'] + '</p></li>')
    }
}





$(document).ready(function () {
    //collapsibles
    $('#horns_div').on('click', '.collapsible', function () {
        let content = $(this).next('.content');
        content.slideToggle(100);
    })
    let horns_data = null;

    $('#submit_button').prop('disabled', true);
    $('#effect_selector').prop('disabled', true);

    $('#sort_selector').on('change', function () {
        display_horns(horns_data)
    })
    $('#submit_button').on('click', function () {
        let effects = $('#effect_selector').val()
        let horns_req = $.get(API_URL + '/get_horns_from_effects', { 'melodies': JSON.stringify(effects) })
        horns_req.done(function (data) {
            horns_data = data;
            display_horns(horns_data)
        });
    })


    //get list of effects from the api (also functions as a "ping" test)
    let effects_req = $.get(API_URL + '/get_melody_names')
    effects_req.done(function (data) {
        $('#effect_selector').empty()
        for (let effect in data['response']) {
            $('#effect_selector').append("<option>" + data['response'][effect] + "</option>")
        }
        $('#submit_button').prop('disabled', false);
        $('#effect_selector').prop('disabled', false);
    });
});