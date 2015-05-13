function getToday(){
    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth()+1; //January is 0!
    var yyyy = d.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    return yyyy+mm+dd;
}
function randomNumbers(length){
    var arr = [];
    while(arr.length < length){
        var randomnumber=Math.ceil(Math.random()*length-1);
        var found=false;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==randomnumber){found=true;break}
        }
        if(!found)arr[arr.length]=randomnumber;
    }

    return arr;

}

$(window).resize(function(){
    //console.log($(window).innerHeight()-210);
    $(".angular-google-map-container").css("height", $(window).innerHeight()-210);
});