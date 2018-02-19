
 
 var url_sample_meta_data =  "/metadata/";
 var url_samples =  "/samples/";
 var url_otu =  "/otu";
 var url_wfreq =  "/wfreq/";
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
            $cell.innerText = "" + fields[i] + ": " + response[0][fields[i]];
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

function initGuage(sample){
    // Enter a speed between 0 and 180
    

    Plotly.d3.json(url_wfreq + sample, function(error, response) {

        var wfreq = 0;
        if (error) return console.warn(error);

        wfreq = response[0];
        var level = (180 * wfreq)/9 ;
        console.log(wfreq);

         // Trig to calc meter point
        var degrees = 180 - level,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
                 x: [0], y:[0],
            marker: {size: 28, color:'850000'},
         showlegend: false,
               name: 'washing frequency',
               text: level,
               hoverinfo: 'text+name'},
            { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
            rotation: 90,
                text: ['8-9', '7-8', '6-7', '5-6',
                        '4-5', '3-4','2-3','1-2','0-1', ''],
            textinfo: 'text',
        textposition:'inside',
              marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(232, 226, 202, .5)',
                          'rgba(255, 255, 255, 0)']},
              labels: ['8-9', '7-8', '6-7', '5-6',
              '4-5', '3-4','2-3','1-2','0-1', ''],
              hoverinfo: 'label',
              hole: .5,
              type: 'pie',
              showlegend: false
            }];

        var layout = {
                shapes:[{
                    type: 'path',
                    path: path,
                    fillcolor: '850000',
                    line: {
                      color: '850000'
                    }
                  }],
                title: '<b>Belly Button Washing Frequency</b> <BR>Scrubs per Week </BR> ',
                height: 450,
                width: 450,
                xaxis: {zeroline:false, showticklabels:false,
                           showgrid: false, range: [-1, 1]},
                yaxis: {zeroline:false, showticklabels:false,
                           showgrid: false, range: [-1, 1]}
              };

            Plotly.newPlot('guage-plot', data, layout);

    })

   
}



function init(){

    

    Plotly.d3.json(url_otu, function(error, response) {
        if (error) return console.warn(error);

        otuDescLookUp = response;

    })
   
    Plotly.d3.json("/names", function(error, response) {
   
        // console.log(response);
       
        if (error) return console.warn(error);

       
        // document.write(JSON.stringify(response))

        Plotly.d3.select("#selDataset").selectAll("option").data(response).enter().
                append('option').text(response => response);
   
        initMetaDataSection(response[0]);
        initPieView(response[0],false);

        initGuage(response[0]);
        
     });
  
}


function optionChanged(data){
    // url = "/metadata/" + data;
    // console.log(data);
    initMetaDataSection(data);
    initPieView(data,true);
    initGuage(data)
}

init();




