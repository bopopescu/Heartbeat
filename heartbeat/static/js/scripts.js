function pageLoad() {
    $( ".datePicker" ).datepicker({ dateFormat: 'yy-mm-dd' });
    $( ".timePicker" ).ptTimeSelect({
            onClose: function(element) { jQuery.ptTimeSelect.setTimeIn(element) ;}});
    
    $("input[id$='-track_num']").each(function(i) {
            $(this).val(i+1);
        });
    $("#togglable_album").hide();
    $("#togglable_tour").hide();
    
}
window.onpopstate = function(event) {
    $("#content").load(document.location['pathname']);
}
function loadPage(url, newName, dump) {
    dump = typeof dump !== 'undefined' ? dump : {};
    newName = typeof newName !== 'undefined' ? newName : "";
    $("#content").load(url, pageLoad);
    history.pushState(dump, newName, url);
}
function playPauseSong(artist, album, song) {
    $("#artist").html(artist);
    $("#song").html(song);
    $("#space").html("<a> - </a>");
    
    var playerinfo = $("#player").data("jPlayer");
    var paused = $("#player").data("jPlayer")['status']['paused'];
    var info = $("#player").data("jPlayer")['status']['src'].split('/');
    var sameSong = info[3] == artist
        && info[5] == album
        && info[6] == song + ".mp3";
    
    if (!paused && sameSong) {
        
        $("#player").jPlayer("pause");
        $("#icon_play").attr("class", "icon-play");
        return true;
    } else if (paused && sameSong) {
        $("#player").jPlayer("play");
        $("#icon_play").attr("class", "icon-pause");
        return true;
    } else {
        if (artist != ""
            && album != ""
            && song != "") {
            $("i.icon-pause").toggleClass("icon-pause icon-play");
            $("#player").jPlayer("setMedia", {
                    mp3: "/static/artists/" + artist + "/albums/" + album + "/" + song + ".mp3"
                        }).jPlayer("play");
            $("#icon_play").attr("class", "icon-pause");
            return true;
        }
        return false;
    }    
}

function playSongOrSuggest() {
    if (!playPauseSong("", "", "")) {
        $.ajax({
                type: "GET",
                    url: "/artists/suggest/",
                    success: function(msg) {
                    var artist = msg['artist'];
                    var album = msg['album'];
                    var songname = msg['song'];
                    if (!playPauseSong(artist, album, songname)) {
                        alert("Problem");
                    }
                    
                }
            });
    }
}
function getSong(artist, album, name) {
    window.open("/static/artists/" + artist + "/albums/" + album + "/" + name + ".mp3", "Download");
}
function change(elem) {
    elem.find("i").toggleClass("icon-play icon-pause")
}

$(document).ready(function() {
    $.ajax({
                type: "GET",
                    url: "/users/active/",
                    success: function(msg) {
                    if (msg['username'] != '') {
                        loginUI(msg['username']);
                    }
                    var id = parseInt(msg['artist_id'])
                    if (id >= 0) {
                        $("#username_value").click(function() {
                                loadPage("/artists/" + id + "/");
                            });
                    } else {
                        $("#username_value").click(function() {
                                loadPage("/users/");
                            });
                    }
                }
            });
        loadPage(window.location.pathname);
        $("#icon_play").click(function() {
                playSongOrSuggest();
            });
        $("#player").jPlayer({
                size:$({width:"400",height:"400"}),
                    errorAlerts: true,
                    swfPath: "localhost:8000/static/jPlayer/Jplayer.swf",
                    ready: function() {
                    
                    $(this).bind($.jPlayer.event.play, function() {
                            $(this).jPlayer("pauseOthers");
                            
                        });
                    $(this).bind($.jPlayer.event.pause, function() {

                        });
                    $(this).bind($.jPlayer.event.error, function(event) {
                            if (event.jPlayer.error.type == "e_url") {
                                $(this).jPlayer("play").delay(100);
                            }
                        });
                }
            });
        

        // Code adapted from http://djangosnippets.org/snippets/1389/  
        function updateElementIndex(el, prefix, ndx) {
            var id_regex = new RegExp('(' + prefix + '-\\d+-)');
            var replacement = prefix + '-' + ndx + '-';
            if ($(el).attr("for")) $(el).attr("for", $(el).attr("for").replace(id_regex,
                                                                               replacement));
            if (el.id) el.id = el.id.replace(id_regex, replacement);
            if (el.name) el.name = el.name.replace(id_regex, replacement);
            if (el.id.match(/track_num$/)) {
                el.value = (ndx + 1);
            }
        }
        function deleteForm(btn, prefix, label) {
            var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
            if (formCount > 1) {
                // Delete the item/form
                $(btn).parents('.' + label).hide('slow', function() { 
                        $(btn).parents('.' + label).remove();
                        var forms = $('.' + label); // Get all the forms  
                        // Update the total number of forms (1 less than before)
                        $('#id_' + prefix + '-TOTAL_FORMS').val(forms.length);
                        var i = 0;
                        // Go through the forms and set their indices, names and IDs
                        forms.each(function(i) {
                                $(this).find(':input').each(function() {
                                        if ($(this).attr('type') != 'button') {
                                            updateElementIndex(this, prefix, i)

                                        }

                                    });

                            });
                    });
            } // End if

            return false;
        }

        function addForm(btn, prefix, label, deletebtn) {
            var formCount = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val());
            // You can only submit a maximum of 10 todo items 
            if (formCount < 30) {
                // Clone a form (without event handlers) from the first form
                var row = $("." + label + ":first").clone(false).get(0);
                // Hack to make it work with the file uploads
                if (prefix == "song") {
                    var tmp = $(row).find("[id$='download_link']");
                    $(row).find(".controls.docs-input-sizes")[1].innerHTML = $(row).find("[id$='download_link']")[0].outerHTML
                } else if (prefix == "concert") {
                    $(row).find(".controls.docs-input-sizes")[5].innerHTML = $(row).find("[id$='icon']")[0].outerHTML
                }
                // Insert it after the last form
                $(row).removeAttr('id').hide().insertAfter("." + label + ":last").slideDown(300);

                // Remove the bits we don't want in the new row/form
                // e.g. error messages
                $(".errorlist", row).remove();
                $(row).children().removeClass("error");

                // Relabel or rename all the relevant bits
                
                
                $(row).find(':input').each(function() {
                        if ($(this).attr('type') != 'button') {
                                updateElementIndex(this, prefix, formCount);
                                if (! this.id.match(/track_num$/)) {
                                    $(this).val("");
                                }
                            }
                    });


                // Add an event handler for the delete item/form link 
                $(row).find("#" + deletebtn).click(function() {
                        return deleteForm(this, prefix, label);
                        });
                // Update the total form count
                $("#id_" + prefix + "-TOTAL_FORMS").val(formCount + 1);
            } // End if
            else {
                //                alert("Sorry, you can only enter a maximum of ten items.");
            }
            return false;
        }

        // Register the click event handlers
        $("#add").live("click", function() {
                return addForm(this, "song", "song", "delete");
            });
        $("#add_concert").live("click", function() {
                return addForm(this, "concert", "concert", "delete_concert");
            });

        $(".delete").live("click", function() {
                return deleteForm(this, "song", "song", "delete");
            });
        $(".delete_concert").live("click", function() {
                return deleteForm(this, "concert", "concert", "delete_concert");
            });
        
        $(":submit#concert_submit").live("click", function() {
                var counter=0;
                $('.concert').each(function() {
                        if ($(this).find("[id$='venue']").val() != ""
                            && $(this).find("[id$='address']").val() != ""
                            && $(this).find("[id$='city']").val() != ""
                            && $(this).find("[id$='state']").val() != ""
                            && $(this).find("[id$='country']").val() != ""
                            && ($(this).find("[id$='icon']").val() != ""
                                || $(this).find('a').length > 0)
                            && $(this).find("[id$='date']").val() != ""
                            && $(this).find("[id$='time']").val() != "") {
                            counter++;
                        }
                                         
                    });
                $("#id_concert-TOTAL_FORMS").val(counter);

            });



        $("#toggle_album").live("click", function() {
                var tmp = $("#togglable_album");
                tmp.toggle("slow");

            });

        $("#toggle_tour").live("click", function() {
                var tmp = $("#togglable_tour");
                tmp.toggle("slow");

            });
        $("#toggle_albumsview").live("click", function() {
                var tmp = $("#togglable_albumsview");
                tmp.toggle("slow");

            });
        $("#toggle_toursview").live("click", function() {
                var tmp = $("#togglable_toursview");
                tmp.toggle("slow");

            });
        $(".toggle_albumview").live("click", function() {
                var next = $(this).parent().find("#togglable_albumview");
                next.toggle("slow");
            });
        $(".toggle_tourview").live("click", function() {
                var next = $(this).parent().find("#togglable_tourview");
                next.toggle("slow");
            });
        $("#username_login").live("click", function() {
                $(".dropdown").toggleClass("open");

            });
        var mouse_inside = false;
        document.addEventListener("mouseup", function() {
                if (! mouse_inside) {
                    $(".dropdown").removeClass("open");
                }
            });

        $(".dropdown").live({
                mouseenter: function(event) {
                    mouse_inside = true;
                },
                    mouseleave: function() {
                    mouse_inside = false;
                }
            });
    });