/**
 * Created by Edel on 2017/7/18.
 */

$(() =>{
    const loadTarget = el => {
        const target = `../html/${$(el.target).attr('data-href')}`;
        $("#sidebar").find('.active').removeClass('active');
        $(el.target).parent().addClass('active');
        main.load(target);
    };

    const sideBar = $("#sidebar");
    const main = $("#content");

    sideBar.load('../include/sidebar.html', () => {
        sideBar.find('a').click(loadTarget);
        main.load('../html/main.html')
    });

    let odUser = localStorage.getItem('odUser');
    let odPass = localStorage.getItem('odPass');

    if(!(odUser && odPass)){
        $('#odConfirm').modal();
    }

    $('#btnSubmit').click(() => {
        console.log($('#txtOdUser').val());
        console.log($('#txtOdPass').val());
    });
});