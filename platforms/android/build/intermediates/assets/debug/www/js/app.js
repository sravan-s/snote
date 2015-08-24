(function () {
// 
    function supports_html5_storage() {
      try {
          return 'localStorage' in window && window['localStorage'] !== null;
       } catch (e) {
           alert("Cannot store user preferences in this O/S");
            return false;
      }
    }
    var sid;
    function listallnotes(){
        $.post( "http://sharenote.uphero.com/notes.php", { sid : sid}, function(result){
                    result.forEach(function(obj){
                        console.log(obj);
                        var nid = obj.noteId;
                        var ntitle = obj.noteTitle;
                        var nloc = obj.noteLocation;
                        var nrating = obj.noteRating;
                        var heading ="<h4>"+ntitle+"</h4>";
                        var optionContent = "<p><a href =\""+nloc+"\">download</a></p><p>Rating:"+nrating+"</p>";
                        var innerOption = "<div class=\"noteBlock\">"+heading+optionContent+"</div>";
                        $("#notes-holder").append(innerOption);
                    });
                });
    }
    supports_html5_storage();
    var myStorage = window.localStorage;
    if(myStorage.getItem("token") == null){
        console.log("go to signup");
    }
    if(myStorage.getItem("recentSem")==null){
        
    } else{
        sid = myStorage.getItem("recentSem");
        alert(sid);
        listallnotes();
        console.log("changing pages");
        $.mobile.navigate("#notes", {
            transition: "slide"
        });
    }
    console.log(myStorage);
    var connectionState;
    function getUniversitylist() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var results = JSON.parse(xmlhttp.responseText);
                results.forEach(function (obj) {
                    var uid = JSON.stringify(obj.universityId);
                    var uname = JSON.stringify(obj.universityFullName);
                    var innerOption = "<option value=" + uid + ">" + uname.replace(/['"]+/g, '') + "</option>";
                    console.log(innerOption);
                    $("#universities").append(innerOption);
              });
            }
          }
        if(xmlhttp.open("GET","http:www.sharenote.uphero.com/universityList.php",true)){
            console.log("req.open");
        }
        else{
            console.log("cml.http.req.notworking");
         }
        if(xmlhttp.send()){
            console.log(xmlhttp);
        } else{
            console.log(xmlhttp);
        }
    }
    
//    Execution
    
    getUniversitylist();
    
    $(document).ready( function(){
        connectionState = navigator.onLine;
        if(!connectionState) {
            alert("offline");
        } 
        $(document).on('offline online', function (event) {
            if(event.type == "offline"){
                connectionState = false;
            } else {
                connectionState= true;
            }
        });
        
        $('#listNextBtn').button({disabled: true});
        $('#universities').on('change', function() {
            var uid = this.value;
            $.post( "http:www.sharenote.uphero.com/courses.php", { uid: uid }, function(result){
                result.forEach(function(obj){
                    var cid = obj.courseId;
                    var cname = obj.courseName;
                    var innerOption = "<option value="+cid+">"+cname.replace(/['"]+/g, '')+"</option>";
                    $("#select-course").append(innerOption);
                });
            });
         });
        $('#select-course').on('change', function() {
            var cid = this.value;
            $.post( "http://sharenote.uphero.com/branches.php", { cid: cid }, function(result){
                result.forEach(function(obj){
                    var bid = obj.branchId;
                    var bname = obj.branchName;
                    var innerOption = "<option value="+bid+">"+bname.replace(/['"]+/g, '')+"</option>";
                    $("#select-branch").append(innerOption);
                });
            });
         });
        
        $('#select-branch').on('change', function () {
            var bid = this.value;
            if(bid != '-1'){
                $.post( "http://sharenote.uphero.com/semesters.php", { bid: bid}, function(result){
                    result.forEach(function(obj){
                        var sid = obj.semesterId;
                        var sname = obj.semesterName;
                        var innerOption = "<option value="+sid+">"+sname.replace(/['"]+/g, '')+"</option>";
                        $("#semester-holder").append(innerOption);
                    });
                });
                
                $('#listNextBtn').button({disabled: false});
                $("#notesBtn").button({disabled: true});
                
            } else {
                $('#listNextBtn').button({disabled: true});
            }
            
        });
        $("#semester-holder").on('change', function(){
            sid = this.value;
            if(sid != -1){
                $("#notesBtn").button({disabled: false});
                
            }
        });
        $('#notesBtn').click(function(){
            myStorage.setItem("recentSem", sid);
            console.log(sid);
            listallnotes();
        });
    });
    
}());