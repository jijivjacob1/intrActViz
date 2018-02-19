
 var first_name = '' ;
 var url_sample_meta_data =  "/metadata/";
 var url_samples =  "/samples/";
 var url_otu =  "/otu";
 var $tbody = document.querySelector("tbody");
 var $PIE = document.getElementById("pie-plot");
 var $SCATTER = document.getElementById("scatter-plot");
 var otuDescLookUp;

function initMetaDataSection(sample){

    Plotly.d3.json(url_sample_meta_data + sample, function(error, response) {
   
        // console.log(response);
   
        if (error) return console.warn(error);

        console.log(response[0]);
   
        $tbody.innerHTML = "";

        var fields = Object.keys(response[0]);

        console.log(fields);

        for (var i = 0; i < fields.length ; i++) {
            var $row = $tbody.insertRow(i);
            var $cell = $row.insertCell(0);
            $cell.innerText = "" + fields[i] + ":" + response[0][fields[i]];
        }
    
    });

}

function initPieView(sample,replot){

   

    Plotly.d3.json(url_samples + sample, function(error, response) {
   
        
   
        if (error) return console.warn(error);

        // console.log(response);

        console.log(otuDescLookUp.length);

        labels_disp = response["otu_ids"].slice(0,10).map(d => d);
        values_disp = response["sample_values"].slice(0,10).map(d => d);

        
   
        if (replot) {
            Plotly.restyle($PIE , "labels", [labels_disp]);
            Plotly.restyle($PIE , "values", [values_disp]);
            console.log("replot");
        }
        else {
            var trace1 = {
                labels: labels_disp,
                values: values_disp,
                type: 'pie',
                hoverinfo: 'percent + text' ,
                text : labels_disp.map(d=> otuDescLookUp[d]),
                textinfo : 'percent'
                 };
             var data = [trace1];
            //   var layout = {
            //     title: "'Bar' Chart",
            //   };
            Plotly.newPlot($PIE , data);
        }

        var trace2 = {
            x: response["otu_ids"].map(d => d),
            y: response["sample_values"].map(d => d),
            mode: 'markers',
            type: 'scatter',
            text: response["otu_ids"].map(otu_id =>  otuDescLookUp[otu_id]),
            marker: { 
                        size: response["sample_values"].map(d => d ),
                        color: response["otu_ids"].map(d => d )
                    }
          };

          var data2 = [trace2];

          Plotly.newPlot($SCATTER, data2);
    
    });

}



function init(){

    

    Plotly.d3.json(url_otu, function(error, response) {
        if (error) return console.warn(error);

        otuDescLookUp = response

    })
   
    Plotly.d3.json("/names", function(error, response) {
   
        // console.log(response);
       
        if (error) return console.warn(error);

       
        // document.write(JSON.stringify(response))

        Plotly.d3.select("#selDataset").selectAll("option").data(response).enter().
                append('option').text(response => response);
   
        initMetaDataSection(response[0]);
        initPieView(response[0],false);

        
        
     });
  
}





function optionChanged(data){
    // url = "/metadata/" + data;
    // console.log(data);
    initMetaDataSection(data);
    initPieView(data,true);
}

init();




