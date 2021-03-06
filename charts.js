function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // ------------------DELIVERABLE 1 CREATE A HORIZONTAL BAR CHART:----------------------------------------
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var samplesArray = samples.filter(sampleObjects => sampleObjects.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = samplesArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_IDS = sampleResult.otu_ids;
    var otu_LABELS = sampleResult.otu_labels;
    var sample_VALUES = sampleResult.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_IDS.slice(0, 10).map(id => "OTU" + id).reverse();

    // // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_VALUES.slice(0, 10).reverse(),
      y: yticks,
      text: otu_LABELS.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Bacteria Amount" },
      yaxis: { title: "Species ID" }

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // --------------------DELIVERABLE 2 CREATE BUBBLE CHART--------------------------------------


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_IDS,
      y: sample_VALUES,
      text: otu_LABELS,
      mode: 'markers',
      marker: { size: sample_VALUES, color: otu_IDS, colorscale: 'Earth' }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      margin: { t: 100 },
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // --------------------DELIVERABLE 3 CREATE GAUGE CHART -----------------------------------------

    // 1. Create a variable that filters the metadata array for an object in the array 
    // whose id property matches the ID number passed into buildCharts() function as the argument.
    var metadataArray = data.metadata.filter(metaObjects => metaObjects.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array
    var result = metadataArray[0];

    // 3. Create a variable that converts the washing frequency to a floating point number.
    var wfreq = parseFloat(result.wfreq);

    //   // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      value: wfreq,
      mode: "gauge+number",
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week" },
      gauge: {
        axis: { range: [null, 10], dtick: 2 },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "yellowgreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];

    //   // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 400,
      height: 400,
      margin: { t: 0, r: 25, l: 25, b: 0 },

    };

    //   // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
};

