get_vars_from_site = function (resultList){
  let indexs= $("#site_choose")['0'].value;

  console.log(indexs)
  request_obj = {}
  request_obj['hs_url'] = $("#url_WOF").text()
  request_obj['network'] = resultList[indexs]['network']
  request_obj['code'] = resultList[indexs]['sitecode']
  let var_select = $("#variable_choose");

  console.log(request_obj)
  $.ajax({
    type:"GET",
    url: `get-values-hs`,
    dataType: "JSON",
    data: request_obj,
    success: function(result){
      console.log(result)
      let variables_ = result['variables'];
      for(let i=0; i< variables.length; ++i){

        option_begin = `<option value=${i}>${result1['siteInfo'][i]['sitename']} </option>`;
        site_select.append(option_begin)
      }
    },
    error:function(){
      $.notify(
          {
              message: `Something went wrong when loading the variables for the site`
          },
          {
              type: "danger",
              allow_dismiss: true,
              z_index: 20000,
              delay: 5000
          }
      )
    }
})
}


// $("#btn-download-colab").on("click", download_python_notebook);



map_layers = function(sites,title,url){

  sites = sites.map(site => {
      return {
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: ol.proj.transform(
                  [
                      parseFloat(site.longitude),
                      parseFloat(site.latitude)
                  ],
                  "EPSG:4326",
                  "EPSG:3857"
              )
          },
          properties: {
              name: site.sitename,
              code: site.sitecode,
              network: site.network,
              hs_url: url,
              hs_name: title,
              lon: parseFloat(site.longitude),
              lat: parseFloat(site.latitude)
          }
      }
  })

  let sitesGeoJSON = {
      type: "FeatureCollection",
      crs: {
          type: "name",
          properties: {
              name: "EPSG:3857"
          }
      },
      features: sites
  }

  const vectorSource = new ol.source.Vector({
      features: new ol.format.GeoJSON().readFeatures(
          sitesGeoJSON
      )
  })
  var clusterSource = new ol.source.Cluster({
     distance: parseInt(30, 10),
     source: vectorSource,
   });
  if(layerColorDict.hasOwnProperty(title) == false){
    layerColorDict[title] = get_new_color();

  }

  let style_custom = featureStyle(layerColorDict[title])
  var vectorLayer = new ol.layer.Vector({
    source: clusterSource,
    style: style_custom
  });
  return [vectorLayer,vectorSource]

}





/*
****** FU1NCTION NAME : load_individual_hydroservers_group*********
****** FUNCTION PURPOSE: LOADS THE SERVERS OF A HYDROSERVER WHEN THE HYDROSERVER GROUPS IS CLICKED*********
*/
  load_individual_hydroservers_group = function(group_name){
     // let servers_with_keywords = [];
     // let key_words_to_search = get_all_the_checked_keywords();
     let group_name_obj={
       group: group_name
     };
     //console.log(group_name_obj);
     $("#GeneralLoading").css({
        position:'fixed',
        "z-index": 9999,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      });
     $("#GeneralLoading").removeClass("hidden");
         $.ajax({
             type: "GET",
             url: `catalog-group`,
             dataType: "JSON",
             data: group_name_obj,
             success: result => {
                 //console.log(result);
                 let servers = result["hydroserver"]
                 // //console.log("this are the servers");
                 // //console.log(servers);


                 // $("#current-servers").empty() //Resetting the catalog

                 //USE A FUNCTION TO FIND THE LI ASSOCIATED WITH THAT GROUP  AND DELETE IT FROM THE MAP AND MAKE ALL
                 // THE CHECKBOXES VISIBLE //

                 let extent = ol.extent.createEmpty()
                 // //console.log(servers);
                 let id_group_separator = `${group_name}_list_separator`;

                 if(servers.length <= 0){
                   let no_servers = `<button class="btn btn-danger btn-block noGroups"> The group does not have hydroservers</button>`
                   $(no_servers).appendTo(`#${id_group_separator}`) ;
                 }
                 servers.forEach(function(server){
                   // console.log(server)
                     let {
                         title,
                         url,
                         siteInfo
                     } = server
                     information_model[`${group_name}`].push(title);

                     title = title.replace(/ /g,"-");
                     // if(keywords_in_servers.includes(title) || key_words_to_search.length == 0){
                       // //console.log(keywords_in_servers.includes(title));
                       let newHtml = html_for_servers(title,group_name);
                       // $(newHtml).appendTo("#current-servers")
                       $(newHtml).appendTo(`#${id_group_separator}`);
                       //console.log($(newHtml));
                       $(`#${group_name}_${title}_del_endpoint`).on("click", function(){
                           delete_hydroserver_Individual(group_name, title)
                       });

                       $(`#${title}_variables`).on("click",showVariables);
                       $(`#${title}_variables_info`).on("click",hydroserver_information);
                       $(`#${title}_${group_name}_reload`).on("click",update_hydroserver);


                       let lis = document.getElementById(`${id_group_separator}`).getElementsByTagName("li");
                       let li_arrays = Array.from(lis);
                       let li_arrays2 = Array.from(lis);

                       let input_check = li_arrays.filter(x => title === x.attributes['layer-name'].value)[0].getElementsByClassName("chkbx-layer")[0];


                       input_check.addEventListener("change", function(){
                         let check_box = this;
                         map.getLayers().forEach(function(layer) {
                           if(layer_object_filter.hasOwnProperty(title) == false){
                             console.log("false")
                             if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                               console.log(this)
                               if(check_box.checked){

                                 layer.setStyle(featureStyle(layerColorDict[title]));
                               }
                               else{
                                 layer.setStyle(new ol.style.Style({}));
                               }
                             }
                           }
                           else{
                             console.log("true")
                             if(layer instanceof ol.layer.Vector && layer == layer_object_filter[title]){
                               if(check_box.checked){

                                 layer.setStyle(featureStyle(layerColorDict[title]));
                               }
                               else{
                                 layer.setStyle(new ol.style.Style({}));
                               }
                             }
                           }
                          });


                         // if(this.checked){
                         //
                         //
                         //   map.getLayers().forEach(function(layer) {
                         //        if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                         //          //console.log(layer)
                         //          layer.setStyle(featureStyle(layerColorDict[title]));
                         //        }
                         //    });
                         // }
                         // else{
                         //   map.getLayers().forEach(function(layer) {
                         //        if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                         //          //console.log(layer)
                         //          layer.setStyle(new ol.style.Style({}));
                         //        }
                         //    });
                         //
                         // }

                       });




                       // let sites = siteInfo
                       // // //console.log(title)
                       // // //console.log(typeof(sites))
                       // // //console.log(sites);
                       // if (typeof(sites) == "string"){
                       //   // //console.log("inside strng");
                       //   sites = JSON.parse(siteInfo);
                       // }
                       // sites = sites.map(site => {
                       //     return {
                       //         type: "Feature",
                       //         geometry: {
                       //             type: "Point",
                       //             coordinates: ol.proj.transform(
                       //                 [
                       //                     parseFloat(site.longitude),
                       //                     parseFloat(site.latitude)
                       //                 ],
                       //                 "EPSG:4326",
                       //                 "EPSG:3857"
                       //             )
                       //         },
                       //         properties: {
                       //             name: site.sitename,
                       //             code: site.sitecode,
                       //             network: site.network,
                       //             hs_url: url,
                       //             hs_name: title,
                       //             lon: parseFloat(site.longitude),
                       //             lat: parseFloat(site.latitude)
                       //         }
                       //     }
                       // })
                       //
                       // let sitesGeoJSON = {
                       //     type: "FeatureCollection",
                       //     crs: {
                       //         type: "name",
                       //         properties: {
                       //             name: "EPSG:3857"
                       //         }
                       //     },
                       //     features: sites
                       // }
                       //
                       // const vectorSource = new ol.source.Vector({
                       //     features: new ol.format.GeoJSON().readFeatures(
                       //         sitesGeoJSON
                       //     )
                       // })
                       // var clusterSource = new ol.source.Cluster({
                       //    distance: parseInt(30, 10),
                       //    source: vectorSource,
                       //  });
                       // layerColorDict[title] = get_new_color();
                       // // const vectorLayer = new ol.layer.Vector({
                       // //     source: vectorSource,
                       // //     style: featureStyle(layerColorDict[title])
                       // // })
                       // let style_custom = featureStyle(layerColorDict[title])
                       // var vectorLayer = new ol.layer.Vector({
                       //   source: clusterSource,
                       //   style: style_custom
                       // });
                       let sites = siteInfo
                       if (typeof(sites) == "string"){
                         sites = JSON.parse(siteInfo);
                       }
                       console.log(sites.length)
                       var vectorLayer = map_layers(sites,title,url)[0]
                       var vectorSource = map_layers(sites,title,url)[1]
                       //console.log(style_custom)

                       let test_style = new ol.style.Style({
                         image: new ol.style.Circle({
                           radius: 10,
                           stroke: new ol.style.Stroke({
                             color: "white",
                           }),
                           fill: new ol.style.Fill({
                             color: layerColorDict[title],
                           }),
                         })
                       });
                       // getIconLegend(test_style,title);
                       let rowHTML= `<tr id= ${title}-row-complete>
                                      <th id="${title}-row-legend"></th>
                                      <th>${title}</th>
                                    </tr>`
                      if(!document.getElementById(`${title}-row-complete`)){
                        $(rowHTML).appendTo('#tableLegend');
                      }
                      $(`#${title}-row-legend`).prepend($(getIconLegend(test_style,title)));
                      // $('#legendSymbol').prepend($(getIconLegend(test_style,title)));


                       // $('#legendText').prepend(`<p>${title}</p>`);

                       // const vectorLayer = new ol.layer.Vector({
                       //     source: vectorSource,
                       //     style: featureStyle()
                       // })

                       map.addLayer(vectorLayer);
                       // map.addLayer(vectorLayer2);
                       vectorLayer.setStyle(new ol.style.Style({}));
                       // ext = ol.proj.transformExtent(vectorSource.getExtent(), ol.proj.get('EPSG:3857'), ol.proj.get('EPSG:4326'));
                       // layersDictExt[title] = ext;

                       // //console.log(ext)

                       // ol.extent.extend(extent, vectorSource.getExtent())

                       vectorLayer.set("selectable", true)

                       layersDict[title] = vectorLayer;
                       $(`#${title}_zoom`).on("click",function(){
                         map.getView().fit(vectorSource.getExtent());
                         map.updateSize();
                       });
                   // }
                 })
                 let no_servers = `<button class="btn btn-danger btn-block" id = "${group_name}-noGroups"> The group does not have hydroservers</button>`
                 $(no_servers).appendTo(`#${id_group_separator}`);
                 $(`#${group_name}-noGroups`).addClass("hidden");


             },
             error: function(error) {
                 $.notify(
                     {
                         message: `Something went wrong loading the hydroservers for the group called ${group_name}. Please see the console for details.`
                     },
                     {
                         type: "danger",
                         allow_dismiss: true,
                         z_index: 20000,
                         delay: 5000
                     }
                 )
             }
         })
         $("#GeneralLoading").addClass("hidden");

       // },


     // })

   };


/*
****** FU1NCTION NAME: add_hydroserver *********
****** FUNCTION PURPOSE: ADD AN INDIVIDUAL HYDROSERVER TO A GROUP *********
*/

add_hydroserver = function(){
  if($("#extent").is(":checked")){
    var zoom= map.getView().getZoom();
    if(zoom < 5){
        $modalAddSOAP.find(".warning").html("<b>The zoom level has to be 8 or greater. Please check and try again.</b>")
        return false
    }
    else {
      $modalAddSOAP.find(".warning").html("")
    }
    $('#chk_val').empty()
    var level=map.getView().calculateExtent(map.getSize())
    //console.log("LEVELMAP"+ level)
    $(
          '<input type="text" name="extent_val" id="extent_val" value=' +
              '"' +
              level +
              '"' +
              " hidden>"
      ).appendTo($("#chk_val"))
  }
  if($("#soap-title").val() == ""){
    $modalAddSOAP.find(".warning").html(  "<b>Please enter a title. This field cannot be blank.</b>")
    return false
  }
  else {
    $modalAddSOAP.find(".warning").html("")
  }
  if($("#soap-url").val() == "http://hydroportal.cuahsi.org/nwisdv/cuahsi_1_1.asmx?WSDL" ||$("#soap-url").val() =="http://hydroportal.cuahsi.org/nwisuv/cuahsi_1_1.asmx?WSDL"){
      $modalAddSOAP
            .find(".warning")
            .html(
                "<b>Please zoom in further to be able to access the NWIS Values</b>"
            )
        return false
    }
    else {
        $modalAddSOAP.find(".warning").html("")
    }
    if ($("#soap-title").val() != "") {
      // var regex = new RegExp("^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$")
      // var regex = new RegExp("^(?![0-9]*$)[a-zA-Z0-9_]+$")
      var regex = new RegExp("^(?![0-9]*$)[a-zA-Z0-9]+$")

      var title = $("#soap-title").val()
      if (!regex.test(title)) {
          $modalAddSOAP
              .find(".warning")
              .html("<b>Please enter Letters only for the title.</b>");
          return false
      }
    } else {
        $modalAddSOAP.find(".warning").html("");
    }
    var datastring = $modalAddSOAP.serialize();
    datastring += actual_group;


    //console.log("This is the serialize string of datastring");
    //console.log(datastring);
    //Submitting the data to the controller
    $("#soapAddLoading").removeClass("hidden");


    $.ajax({
        type: "POST",
        url: `soap-group/`,
        dataType: "HTML",
        data: datastring,
        success: function(result) {

            //Returning the geoserver layer metadata from the controller
            var json_response = JSON.parse(result)
            //console.log(json_response);
            let group_name = actual_group.split('=')[1];
            let id_group_separator = `${group_name}_list_separator`;

            try{
              if (json_response.status === "true") {
                  // put the ajax call and also the filter //
                  let servers_with_keywords = [];
                  let key_words_to_search = get_all_the_checked_keywords();
                  let group_name_obj={
                    group: group_name
                  };
                  //console.log(group_name_obj);
                    let {title, siteInfo, url, group} = json_response


                      let sites = siteInfo

                      if (typeof(sites) == "string"){
                        sites = JSON.parse(siteInfo);
                      }
                      var vectorLayer = map_layers(sites,title,url)[0]
                      var vectorSource = map_layers(sites,title,url)[1]
                      //console.log(style_custom)

                      let test_style = new ol.style.Style({
                        image: new ol.style.Circle({
                          radius: 10,
                          stroke: new ol.style.Stroke({
                            color: "white",
                          }),
                          fill: new ol.style.Fill({
                            color: layerColorDict[title],
                          }),
                        })
                      });
                      // getIconLegend(test_style,title);
                      let rowHTML= `<tr id= ${title}-row-complete>
                                     <th id="${title}-row-legend"></th>
                                     <th>${title}</th>
                                   </tr>`
                     if(!document.getElementById(`${title}-row-complete`)){
                       $(rowHTML).appendTo('#tableLegend');
                     }
                     $(`#${title}-row-legend`).prepend($(getIconLegend(test_style,title)));


                      map.addLayer(vectorLayer);
                      // vectorLayer.setStyle(new ol.style.Style({}));

                      vectorLayer.set("selectable", true)
                      map.getView().fit(vectorSource.getExtent());
                      map.updateSize();
                      layersDict[title] = vectorLayer;


                        let no_servers_tag = Array.from(document.getElementById(`${id_group_separator}`).getElementsByTagName("P"))[0];
                        //console.log(no_servers_tag);
                        let newHtml = html_for_servers(title,group_name)
                         // $(newHtml).appendTo("#current-servers")
                         $(newHtml).appendTo(`#${id_group_separator}`);
                         //console.log($(newHtml));
                         $(`#${title}_variables`).on("click",showVariables);
                         $(`#${title}_variables_info`).on("click",hydroserver_information);
                         $(`#${title}_${group_name}_reload`).on("click",update_hydroserver);

                        // document.getElementById(`${title}`).style.visibility = "hidden";


                        // MAKES THE LAYER INVISIBLE

                        let lis = document.getElementById("current-Groupservers").getElementsByTagName("li");
                        //console.log(lis);
                        let li_arrays = Array.from(lis);
                        //console.log(li_arrays);
                        // let input_check = li_arrays.filter(x => title === x.attributes['layer-name'].value)[0];
                        let input_check = li_arrays.filter(x => title === x.attributes['layer-name'].value)[0].getElementsByClassName("chkbx-layer")[0];

                        //console.log(input_check);
                        input_check.addEventListener("change", function(){
                          if(this.checked){
                            map.getLayers().forEach(function(layer) {
                                 if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                                   //console.log(layer)
                                   layer.setStyle(featureStyle(layerColorDict[title]));
                                 }
                             });
                          }
                          else{
                            map.getLayers().forEach(function(layer) {
                                 if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                                   //console.log(layer)
                                   layer.setStyle(new ol.style.Style({}));
                                 }
                             });

                          }

                        });
                        $(`#${title}_zoom`).on("click",function(){
                          map.getView().fit(vectorSource.getExtent());
                          map.updateSize();
                        });

                        $.notify(
                            {
                                message: `Successfully Added the HydroServer to the Map`
                            },
                            {
                                type: "success",
                                allow_dismiss: true,
                                z_index: 20000,
                                delay: 5000
                            }
                        )
                        $("#soapAddLoading").addClass("hidden")
                        $("#btn-add-soap").show()

                        $("#modalAddSoap").modal("hide")
                        $("#modalAddSoap").each(function() {
                            this.reset()
                        })

                      }

            }
            catch(err){
                      $("#soapAddLoading").addClass("hidden")
                      $.notify(
                          {
                              message: `The following error ocurred: ${err}`
                          },
                          {
                              type: "danger",
                              allow_dismiss: true,
                              z_index: 20000,
                              delay: 5000
                          }
                      )
                    }


              // }


        },
        error: function(error) {
            $("#soapAddLoading").addClass("hidden")
            $("#btn-add-soap").show();
            //console.log(error);
            $.notify(
                {
                    message: `Invalid Hydroserver SOAP Url. Please check and try again.`
                },
                {
                    type: "danger",
                    allow_dismiss: true,
                    z_index: 20000,
                    delay: 5000
                }
            )
        }
    })

}

$("#btn-add-soap").on("click", add_hydroserver);


/*
****** FU1NCTION NAME: delete_hydroserver *********
****** FUNCTION PURPOSE: DELETE THE SELECTED HYDROSERVERS OF A GROUP*********
*/

delete_hydroserver= function(){
    $modalInterface.find(".success").html("")
    let arrayActual_group=actual_group.split('=')[1];
    var datastring = $modalDelete.serialize() //Delete the record in the database
    datastring += actual_group;
    console.log(datastring);
    $.ajax({
        type: "POST",
        url: `delete-group-hydroserver/`,
        data: datastring,
        dataType: "HTML",
        success: function(result) {
            //console.log(result);
            var json_response = JSON.parse(result)
            //console.log(json_response);
            $("#modalDelete").modal("hide")
            $("#modalDelete").each(function() {
                this.reset()
            })
            for(let i=0; i<Object.keys(json_response).length; ++i){

              let i_string=i.toString();
              let title=json_response[i_string];
              $(`#${title}-row-complete`).remove()

              let element = document.getElementById(title);
              element.parentNode.removeChild(element);
              //Removing layer from the frontend
              //console.log(title);
              map.removeLayer(layersDict[title])
              delete layersDict[title]
              map.updateSize()
              //console.log(arrayActual_group);

              let id_group_separator = `${arrayActual_group}_list_separator`;
              let separator_element = document.getElementById(id_group_separator);
              //console.log(separator_element);
              let children_element = Array.from(separator_element.children);
              //console.log(children_element);
              if(children_element.length < 1){
                let no_servers = `<button class="btn btn-danger btn-block noGroups"> The group does not have hydroservers</button>`
                    $(no_servers).appendTo(`#${id_group_separator}`) ;
              }
              $(`#${title}deleteID`).remove();

              $.notify(
                  {
                      message: `Successfully Deleted the HydroServer!`
                  },
                  {
                      type: "success",
                      allow_dismiss: true,
                      z_index: 20000,
                      delay: 5000
                  }
              )

            }

        },
        error: error => {
            //console.log(error);
            $.notify(
                {
                    message: `Something were wrong while deleting a hydroserver or group of hydroservers!`
                },
                {
                    type: "danger",
                    allow_dismiss: true,
                    z_index: 20000,
                    delay: 5000
                }
            )
        }
    })
}
$("#btn-del-server").on("click", delete_hydroserver)
/*
****** FU1NCTION NAME: delete_hydroserver *********
****** FUNCTION PURPOSE: DELETE THE SELECTED HYDROSERVER OF A GROUP*********
*/

delete_hydroserver_Individual= function(group,server){

    var datastring = `server=${server}&actual-group=${group}`
    //console.log(datastring);
    $.ajax({
        type: "POST",
        url: `delete-group-hydroserver/`,
        data: datastring,
        dataType: "HTML",
        success: function(result) {
            //console.log(result);
            var json_response = JSON.parse(result)
            //console.log(json_response);

            for(let i=0; i<Object.keys(json_response).length; ++i){

              let i_string=i.toString();
              let title=json_response[i_string];
              let element = document.getElementById(title);
              element.parentNode.removeChild(element);
              //Removing layer from the frontend
              //console.log(title);
              map.removeLayer(layersDict[title])
              delete layersDict[title]
              map.updateSize()
              //console.log(group);
              // load_individual_hydroservers_group(arrayActual_group) //Reloading the new catalog
              // get_notification("sucess",`Successfully Deleted the HydroServer!`);
              $(`#${title}-row-complete`).remove();

              let id_group_separator = `${group}_list_separator`;
              let separator_element = document.getElementById(id_group_separator);
              //console.log(separator_element);
              let children_element = Array.from(separator_element.children);
              //console.log(children_element);
              if(children_element.length < 1){
                let no_servers = `<button class="btn btn-danger btn-block noGroups"> The group does not have hydroservers</button>`
                    $(no_servers).appendTo(`#${id_group_separator}`) ;
              }


              $.notify(
                  {
                      message: `Successfully Deleted the HydroServer!`
                  },
                  {
                      type: "success",
                      allow_dismiss: true,
                      z_index: 20000,
                      delay: 5000
                  }
              )


            }

        },
        error: error => {
            //console.log(error);
            // get_notification("danger",`Something were wrong while deleting a hydroserver or group of hydroservers!`);
            $.notify(
                {
                    message: `Something were wrong while deleting a hydroserver or group of hydroservers!`
                },
                {
                    type: "danger",
                    allow_dismiss: true,
                    z_index: 20000,
                    delay: 5000
                }
            )
        }
    })
}

/*
****** FU1NCTION NAME : showVariables*********
****** FUNCTION PURPOSE: RETRIEVES THE DIFFERENT VARIABLES THAT A HYDROSERVER HAS*********
*/

showVariables = function(){
  // Logger.useDefaults({
  //   defaultLevel: Logger.WARN,
  //   formatter: function (messages, context) {
  //     messages.unshift(new Date().toUTCString());
  //   },
  // });
 //console.log("ShowVariables");
 let groupActual = this.parentElement.parentNode.id.split("_")[0];
 let hsActual = this.id.split("_")[0];
 group_show_actual = groupActual;
 hs_show_actual = hsActual;
 // let requestObject= {};
 // requestObject['group']=groupActual;
 // requestObject['hs']=hsActual;
 filterSites['group']=groupActual;
 filterSites['hs']=hsActual;

 let $modalVariables = $("#modalShowVariables")
 $.ajax({
     type: "GET",
     url: `get-variables-hs`,
     dataType: "JSON",
     data: filterSites,
     success: result => {
         //console.log(result);
         var HSTableHtml =
             `<table id="${filterSites['hs']}-variable-table" class="table table-striped table-bordered nowrap" width="100%"><tbody>`
         if (result['variables_name'].length === 0) {
             $modalVariables
                 .find(".modal-body")
                 .html(
                     "<b>There are no variables in the Hydroserver.</b>"
                 )
         }
         else {
             for (var i = 0; i < result['variables_name'].length; i++) {
                 HSTableHtml +=
                '<tr class="odd gradeX2">'+
                     `<td><input type="checkbox" name="name1" value="${result['variables_code'][i]}" />${result['variables_name'][i]}</td>`
                     +
                '</tr>'
             }
             HSTableHtml += "</tbody></table>"
             $modalVariables.find("#hideScroll").html(HSTableHtml)
         }

    }
  })

}
/*
****** FU1NCTION NAME : showAvailableSites*********
****** FUNCTION PURPOSE: SHOW THE SITES THAT HAVE BEEN FILTERED REQURING SPECIFIC VARIABLES*********
*/
showAvailableSites = function(){
  // Logger.useDefaults({
  //   defaultLevel: Logger.WARN,
  //   formatter: function (messages, context) {
  //     messages.unshift(new Date().toUTCString());
  //   },
  // });
 let group = this.baseURI.split("/");
 // ONLY THE KEY WORDS //
 let datastring = Array.from(document.getElementsByClassName("odd gradeX2"));
 console.log(datastring);
 let hs = datastring[0].offsetParent.id.split("-")[0];

 // console.log(group);
 console.log(hs);
 // //console.log(datastring);
 let key_words_to_search=[];
 datastring.forEach(function(data){
   // //console.log(Array.from(data.children));
   Array.from(data.children).forEach(function(column){
     if(Array.from(column.children)[0].checked ==true){
       // //console.log();
       key_words_to_search.push(Array.from(column.children)[0].value.trim())
     }
   })
 });
 // filter_words = key_words_to_search;
 console.log(key_words_to_search);

 let requestObject = {};
 requestObject['hs'] = filterSites['hs'];
 requestObject['group'] = filterSites['group'];
 requestObject['variables'] = key_words_to_search;
 console.log(requestObject);
 $("#variablesLoading").removeClass("hidden");

 $.ajax({
     type: "GET",
     url: `get-available-sites`,
     dataType: "JSON",
     data: requestObject,
     success: result => {
         console.log(result);
         let sites = result['hydroserver'];
         console.log(sites.length)

         let title = filterSites['hs'];
         let url = layersDict[title].values_.source.features[0].values_.features[0].values_.hs_url
         // console.log(layersDict[title])
         // console.log(url)

         const vectorLayer =  map_layers(sites,title,url)[0]
         const vectorSource =  map_layers(sites,title,url)[1]
         // if(layersDict.hasOwnProperty(requestObject['hs'])){
         //    map.removeLayer(layersDict[requestObject['hs']])
         // }

         map.getLayers().forEach(function(layer) {
              if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                  layer.setStyle(new ol.style.Style({}));
                }
          });

         //console.log("layer added to map");
         map.addLayer(vectorLayer)
         // ol.extent.extend(extent, vectorSource.getExtent());
         vectorLayer.set("selectable", true)
         layer_object_filter[title] = vectorLayer;

         //add the reset button ///
         $("#btn-var-reset-server").on("click", function(){
           map.removeLayer(layer_object_filter[title])
           layer_object_filter={};
           if(layersDict.hasOwnProperty(title)){
             // map.addLayer(layersDict[title]);
             map.getLayers().forEach(function(layer) {
                  if(layer instanceof ol.layer.Vector && layer == layersDict[title]){
                    layer.setStyle(featureStyle(layerColorDict[title]));
                    }
              });
           }



           $(`#${hs}`).css({"opacity": "1",
                                "border-color": "#d3d3d3",
                                "border-width":"1px",
                                "border-style":"solid",
                                "color":"#555555",
                                "font-weight": "normal"});

           // $(`#${hs}`).css({'color': '#555555','font-weight':'normal'});

         })
         $("#variablesLoading").addClass("hidden");
         $("#modalShowVariables").modal("hide")
         // $(`#${hs}`).css({'color': 'red','font-weight':'bold'});
         $(`#${hs}`).css({"opacity": "1",
                             "border-color": "#ac2925",
                             "border-width": "2px",
                             "border-style": "solid",
                             "color": "black",
                             "font-weight": "bold"});
    }
  })


}
$(`#btn-var-search-server`).on("click",showAvailableSites);


/*
************ FUNCTION NAME: HYDROSERVER INFORMATION **********************
************ PURPOSE: THE HYDROSERVER INFORMATION LOOKS FOR THE INFORMATION OF THE SITE, SO IT GIVES METADATA ***********
*/

hydroserver_information = function(){
  let groupActual = this.parentElement.parentNode.id.split("_")[0];
  // let stringGroups = this.parentElement.parentNode.id.split("_");
  // let groupActual = ""
  // for(var i = 0; i < stringGroups.length - 1 ; i++){
  //   if (i >0){
  //     groupActual = groupActual +"_"+stringGroups[i]
  //   }
  //   else{
  //     groupActual = groupActual + stringGroups[i]
  //   }
  // }
  let hsActual = this.id.split("_")[0];
  hsActual = hsActual.replace(/-/g, ' ');
  // let string_hs = this.id.split("_");
  // let hsActual = ""
  // for(var i = 0; i < string_hs.length - 1 ; i++){
  //   if (i >0){
  //     hsActual = hsActual +"_"+string_hs[i]
  //   }
  //   else{
  //     hsActual = hsActual + string_hs[i]
  //   }
  // }
  filterSites['group']=groupActual;
  filterSites['hs']=hsActual;
  //console.log(filterSites['hs']);
  $("#hydroserverTitle").html(filterSites['hs']);
  $.ajax({
    type:"GET",
    url: `get-hydroserver-info`,
    dataType: "JSON",
    data: filterSites,
    success: function(result1){
      setTimeout(function(){
        if(map2 ==undefined){
          //console.log("I am undefined");
          map2 = new ol.Map({
                 target: 'map2',
                 layers: [
                   new ol.layer.Tile({
                      source: new ol.source.OSM()
                   })
                 ],
                 view: new ol.View({
                   center: ol.proj.fromLonLat([37.41, 8.82]),
                   zoom: 4
                 })
          });
          actualLayerModal = layersDict[`${result1['title']}`]
          map2.addLayer(actualLayerModal);
          map2.getView().fit(actualLayerModal.getSource().getExtent());
          map2.updateSize();
        }
        else{
          map2.removeLayer(actualLayerModal);
          actualLayerModal=layersDict[`${result1['title']}`];
          map2.addLayer(actualLayerModal);

          map2.getView().fit(actualLayerModal.getSource().getExtent());
          map2.updateSize();
        }


      },400)
      //

      //console.log(result1['url']);

      $("#urlHydroserver").html(result1['url']);
      $("#url_WOF").html($("#urlHydroserver").html());
      let site_select = $("#site_choose");
      $("#description_Hydroserver").html(result1['description']);
      //console.log(result1);
      var HSTableHtml =
          `<table id="${filterSites['hs']}-info-table" class="table table-striped table-bordered nowrap" width="100%"><tbody>`
      if (result1['siteInfo'].length === 0) {
          $("#modalHydroserInformation")
              .find("#infoTable")
              .html(
                  "<b>There are no sites in the Hydroserver.</b>"
              )
      }
      else {
          for (var i = 0; i < result1['siteInfo'].length; i++) {
            option_begin = `<option value=${i}>${result1['siteInfo'][i]['sitename']} </option>`;
            site_select.append(option_begin)
              HSTableHtml +=
             '<tr>'+
                  `<td> <p id="titleSite">${i+1}.- ${result1['siteInfo'][i]['sitename']}
                  <button type="button" class="btn btn-primary" id="${result1['siteInfo'][i]['sitecode']}_modal"><span class="glyphicon glyphicon-pushpin"></span></button></p>
                    <p>Site Code: ${result1['siteInfo'][i]['sitecode']}</p>
                    <p>Network: ${result1['siteInfo'][i]['network']}</p>
                    <p>Latitude: ${result1['siteInfo'][i]['latitude']}</p>
                    <p>Longitude: ${result1['siteInfo'][i]['longitude']}</p>
                  </td>`
                  +
             '</tr>'

          }
          console.log(result1['siteInfo'])
          site_select.selectpicker("refresh");
          $("#site_choose").change(function(){
            console.log(result1['siteInfo'])

            get_vars_from_site(result1['siteInfo'])
          });


          HSTableHtml += "</tbody></table>"
          $("#modalHydroserInformation").find("#infoTable").html(HSTableHtml);
          for (var i = 0; i < result1['siteInfo'].length; i++) {
            //console.log(i);
            //console.log(result1['siteInfo'][i]);
            let lat_modal=result1['siteInfo'][i]['latitude'];
            let lng_modal=result1['siteInfo'][i]['longitude'];
            let coordinate_modal = [lat_modal,lng_modal];

            $(`#${result1['siteInfo'][i]['sitecode']}_modal`).click(function(){
                    if(layersDict['selectedPointModal']){
                      map2.removeLayer(layersDict['selectedPointModal']);
                      map2.updateSize()
                    }

                    let actual_Source = new ol.source.Vector({});
                    let marker = new ol.Feature({
                      geometry: new ol.geom.Point(
                        ol.proj.transform([parseFloat(lng_modal),parseFloat(lat_modal)], 'EPSG:4326','EPSG:3857'))
                    })
                    actual_Source.addFeature(marker);
                    let vectorLayer = new ol.layer.Vector({
                        source: actual_Source,
                        style:  new ol.style.Style({
                            image: new ol.style.Circle({
                                radius: 6,
                                stroke: new ol.style.Stroke({
                                    color: "black",
                                    width: 4
                                }),
                                fill: new ol.style.Fill({
                                    color: `#FF0000`
                                })
                            })
                        })
                    })
                    layersDict['selectedPointModal'] = vectorLayer;
                    map2.addLayer(layersDict['selectedPointModal']);
            });

          }

      }
    }
  })
}
/*
************ FUNCTION NAME: SEARCH SITES **********************
************ PURPOSE: MAKES THE TABLE SEARCHABLE ***********
*/

searchSites = function() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById(`${filterSites['hs']}-info-table`);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
document.getElementById('myInput').addEventListener("keyup", searchSites);


update_hydroserver = function(){
    let hsActual = this.id.split("_")[0];
    let group_name = this.id.split("_")[1]
    let requestObject = {
      // hs: hsActual
      hs: hsActual,
      group: group_name
    }
    $("#GeneralLoading").css({
       position:'fixed',
       "z-index": 9999,
       top: '50%',
       left: '50%',
       transform: 'translate(-50%, -50%)'
     });
    $("#GeneralLoading").removeClass("hidden");


    $.ajax({
        type: "POST",
        url: `soap-update/`,
        dataType: "JSON",
        data: requestObject,
        success: function(result) {
            //console.log(result)
            if(layersDict.hasOwnProperty(hsActual)){
              map.removeLayer(layersDict[hsActual])
            }
            //Returning the geoserver layer metadata from the controller
            // var json_response = JSON.parse(result[siteInfo])
            // //console.log(json_response);
            let {siteInfo,sitesAdded,url} = result

            //console.log(siteInfo)
            // if (json_response.status === "true") {

                    let sites = siteInfo
                    const vectorLayer = map_layers(sites,hsActual,url)[0]
                    const vectorSource = map_layers(sites,hsActual,url)[1]

                    // //console.log(extents);
                    //console.log(sites);
                    // sites = sites.map(site => {
                    //     return {
                    //         type: "Feature",
                    //         geometry: {
                    //             type: "Point",
                    //             coordinates: ol.proj.transform(
                    //                 [
                    //                     parseFloat(site.longitude),
                    //                     parseFloat(site.latitude)
                    //                 ],
                    //                 "EPSG:4326",
                    //                 "EPSG:3857"
                    //             )
                    //         },
                    //         properties: {
                    //             name: site.sitename,
                    //             code: site.sitecode,
                    //             network: site.network,
                    //             hs_url: url,
                    //             hs_name: hsActual,
                    //             lon: parseFloat(site.longitude),
                    //             lat: parseFloat(site.latitude)
                    //         }
                    //     }
                    // })
                    //
                    // let sitesGeoJSON = {
                    //     type: "FeatureCollection",
                    //     crs: {
                    //         type: "name",
                    //         properties: {
                    //             name: "EPSG:3857"
                    //         }
                    //     },
                    //     features: sites
                    // }
                    //
                    // const vectorSource = new ol.source.Vector({
                    //     features: new ol.format.GeoJSON().readFeatures(
                    //         sitesGeoJSON
                    //     )
                    // })
                    //
                    // const vectorLayer = new ol.layer.Vector({
                    //     source: vectorSource,
                    //     style: featureStyle()
                    // })

                    map.addLayer(vectorLayer)
                    ol.extent.extend(extent, vectorSource.getExtent())
                    vectorLayer.set("selectable", true)
                    layersDict[hsActual] = vectorLayer;

                    map.getView().fit(vectorSource.getExtent());
                    map.updateSize();

                    layersDict[hsActual] = vectorLayer;

                      $.notify(
                          {
                              message: `Successfully Reloaded the HydroServer to the Map, ${sitesAdded} have been added to the Hydroserver `
                          },
                          {
                              type: "success",
                              allow_dismiss: true,
                              z_index: 20000,
                              delay: 5000
                          }
                      )
                    $("#GeneralLoading").addClass("hidden");


            // }
          },
        error: function(error) {
            // $("#soapAddLoading").addClass("hidden")
            // $("#btn-add-soap").show();
            //console.log(error);
            $.notify(
                {
                    message: `There was an error realoading the hydroserver.`
                },
                {
                    type: "danger",
                    allow_dismiss: true,
                    z_index: 20000,
                    delay: 5000
                }
            )
        }
    })

}
