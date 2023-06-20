
function createCheckbox(g,x,y,alist) {
    let filterItems = g.selectAll("g.filter-input")
    .data(Object.keys(alist))
    .enter()
    .append("g",":first-child")
    .classed("filter-input",true)
    .on("change",filtered)

    let lbl = filterItems.append("label")
    .attr('for',d=>d)
    .attr('class',"el-checkbox is-checked")
    lbl.append("input")
    .attr("type","checkbox")
    .attr("id",d=>d)
    .attr('class',"el-checkbox__input is-checked")
    .property("checked",true)

    lbl.append("span")
    .attr('class',"el-checkbox__label")
    .text(d=>cleanItUp(alist[d]))
}


function filtered() {
    var choices = [];
    d3.selectAll("g.filter-input").each(
        function(d) {        
            let cb = d3.select(this).select("input");
            if (cb.property("checked")) {
                choices.push(cb.attr("id"));
                // console.log(cb.attr("id"));
            }
            console.log(choices)
        }
    )
    var circlesToShow = new Set()   // Record the gid of the circles to show
    d3.selectAll("circle")
    .each(
        function(d) {
                // let toShow = choices.includes(d.NPS) && choices.includes(d.channel)
                // let toShow = choices.includes(d.channel) && choices.includes(improveTypes[d.improveType])
                // let toShow = choices.includes(d.IMP) && choices.includes(d.channel)
                // let toShow = choices.includes(d.channel) && choices.includes(d.IMP)
                let toShow = choices.includes(d.IMP)
                d3.select(this)
                .classed("fade",!(toShow))
                .classed("show",!(toShow))
                if (toShow) {
                    circlesToShow.add(d.gid)
                }
        }
    )

    // Show/Hide correspond annotation
    d3.selectAll("g.annotation")
    .each(
        function(d){
                d3.select(this)
                .classed("invisible",!(circlesToShow.has(d.gid)));
        }
    )
}

function cleanItUp(str) {
    // var s = str.toLowerCase();
    var s = str;
    if (s.includes('Onboarding,')) {
        s = s.replace('Onboarding,', '');
        return s = s.charAt(1).toUpperCase() + s.slice(2);
    } else {
        return s = s.charAt(0).toUpperCase() + s.slice(1);
    }
}