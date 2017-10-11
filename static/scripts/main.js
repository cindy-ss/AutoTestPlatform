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
    $("#bg_loading").show();
    $.get('/api/init', data => {
        $("#bg_loading").hide();
        const {odUser, odPass} = data;
        console.log(odUser);

        let odAuth = localStorage.getItem('odAuth');
        if(odAuth){
            odAuth = JSON.parse(odAuth);
            txtOdUser.val(odAuth.odUser);
            txtOdPass.val(odAuth.odPass);
        }

        if(!(odUser && odPass)){
            $('#odConfirm').modal();
        }else{
            $("#userName").text(odUser);
        }
    });

    $('#btnSubmit').click(() => {
        $("#bg_loading").show();
        $.post('/api/init', {odUser : txtOdUser.val(), odPass : txtOdPass.val()}, function(data){
            $("#bg_loading").hide();
            console.log(data);
            if(data && data.odPass && data.odUser){
                $("#odConfirm").modal('hide');

                $("#userName").text(data.odUser);

                localStorage.setItem('odAuth', JSON.stringify(data));
            }
        })
    });
    $("#btnUserName").click(() => {
        $('#odConfirm').modal();
    });
});
function list(event){
    event.preventDefault();
    $("#Gp").children('ul').slideDown(100);
}
function listUp(event){
    event.preventDefault();
    $("#Gp").children('ul').slideUp(100);
}
