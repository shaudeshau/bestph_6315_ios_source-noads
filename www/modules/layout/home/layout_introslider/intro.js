if (! localStorage.noFirstVisit) {
    console.log('first time');
    document.getElementById('sldr').style.display = 'block';
	document.getElementById('main').style.display = 'none';
    
    localStorage.noFirstVisit = "1";
}

document.getElementById('restore').onclick = function () {
    localStorage.noFirstVisit = "";
    document.getElementById('restore').innerHTML = "Refresh App";
};

 function toggle_div_fun(id) {

       var divelement = document.getElementById(id);

       if(divelement.style.display == 'none')
          divelement.style.display = 'block';
       else
          divelement.style.display = 'none';
       }