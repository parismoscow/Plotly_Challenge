function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  var metadataSelector = d3.select("#sample-metadata");
  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata
  d3.json(`/metadata/${sample}`).then(data => {
    metadataSelector.html("");
    console.log(Object.entries(data));
    Object.entries(data).forEach(([key, value]) => {
      metadataSelector
        .append("p")
        .text(`${key} : ${value}`)
        .append("hr");
    });
  });

  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
}

// BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
// @TODO: Build a Bubble Chart using the sample data

function bubbleChart(data) {
  let x = data.otu_ids;
  let y = data.sample_values;
  let markersize = data.sample_values;
  let markercolors = data.otu_ids;
  let textvalues = data.otu_labels;

  let trace1 = [
    {
      x: x,
      y: y,
      mode: "markers",
      marker: {
        size: markersize,
        color: markercolors
      },
      text: textvalues
    }
  ];

  let layout1 = {
    title: "<b> Belly Button Bubble Chart </b>",
    xaxis: {
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    },
    width: 1100,
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    paper_bgcolor: "rgba(0, 0, 0, 0)"
  };

  Plotly.newPlot("bubble", trace1, layout1, { responsive: true });
}

// @TODO: Build a Pie Chart
function pieChart(data) {
  console.log(data);
  let labels = data.otu_ids.slice(0, 10);
  let values = data.sample_values.slice(0, 10);
  let hovertext = data.otu_labels.slice(0, 10);

  let trace2 = [
    {
      values: values,
      labels: labels,
      type: "pie",
      textposition: "inside",
      hovertext: hovertext
    }
  ];

  let layout2 = {
    title: "<b> Belly Button Pie Chart </b>",
    plot_bgcolor: "rgba(0, 0, 0, 0)",
    paper_bgcolor: "rgba(0, 0, 0, 0)"
  };

  Plotly.newPlot("pie", trace2, layout2, { responsive: true });
}

// HINT: You will need to use slice() to grab the top 10 sample_values,
// otu_ids, and labels (10 each).

async function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  data = await d3.json(`/samples/${sample}`);
  // ## Pie Chart ##
  pieChart(data);
  // ## Bubble Chart ##
  bubbleChart(data);
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then(sampleNames => {
    sampleNames.forEach(sample => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();
