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
    const txtOdUser = $('#txtOdUser');
    const txtOdPass = $('#txtOdPass');

    sideBar.load('../include/sidebar.html', () => {
        sideBar.find('a').click(loadTarget);
        main.load('../html/main.html')
    });

    $.get('/api/init', data => {
        const {odUser, odPass} = data;
        console.log(odUser);

        if(!(odUser && odPass)){
            $('#odConfirm').modal();
        }
    });

    $('#btnSubmit').click(() => {
        $.post('/api/init', {odUser : txtOdUser.val(), odPass : txtOdPass.val()}, function(data){
            console.log(data);
            if(data && data.odPass && data.odUser){
                $("#odConfirm").modal('hide');
            }
        })
    });
    $(".sideIcon").click(function() {
        if ($("#sidebar").hasClass("navslid-hide")) {
            $("#sidebar").addClass("navslid-show");
            $("#sidebar").removeClass("navslid-hide");
        } else if ($("#sidebar").hasClass("navslid-show")) {
            $("#sidebar").addClass("navslid-hide");
            $("#sidebar").removeClass("navslid-show");
        } else {
            $("#sidebar").addClass("navslid-hide");
        }
    });
});