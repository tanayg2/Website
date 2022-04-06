// $(function () {
//     $("#slider-range").slider({
//         range: true,
//         min: 1951,
//         max: 1975,
//         step: 86400,
//         values: [1951, 1975],
//         slide: function (event, ui) {
//             startYear = ui.values[0];
//             endYear = ui.values[1];
//             $("#amount").val(`"${startYear} - ${endYear}`);
//         }
//     });
//     $("#amount").val(`${$("#slider-range").slider("values", 0)} - ${$("#slider-range").slider("values", 1)}`);
// });

$(function () {
    $("#slider-range").slider({
        range: true,
        min: new Date('1951.01.01').getTime() / 1000,
        max: new Date('1967.01.01').getTime() / 1000,
        step: 86400,
        values: [new Date('1960.01.01').getTime() / 1000, new Date('1975.02.01').getTime() / 1000],
        slide: function (event, ui) {
            startYear = new Date(ui.values[0]*1000).getFullYear();
            endYear = new Date(ui.values[1]*1000).getFullYear();
            $("#amount").val((new Date(ui.values[0] * 1000).toDateString()) + " - " + (new Date(ui.values[1] * 1000)).toDateString());
            updateViz(startYear, endYear);
        }
    });
    $("#amount").val((new Date($("#slider-range").slider("values", 0) * 1000).toDateString()) +
        " - " + (new Date($("#slider-range").slider("values", 1) * 1000)).toDateString());
});