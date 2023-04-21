class Select extends React.Component {
    constructor(props, context) {
        super();
        this.state = {
            selection: props.values[0],
        };
    }

    onSelect(value) {
        this.setState({
            selection: value,
        });
        if (typeof this.props.onSelect === "function")
        this.props.onSelect(this.state.selection); /* not what you expected..*/
    }




    render() {
        return (
            <ul  tabIndex={0}>
                {this.props.values.map((value) => (
                    <li 
                        className={value === this.state.selection ? "selected" : ""} 
                        key={value} 
                        onClick={() => this.onSelect(value)}
                    >
                        {value}
                    </li>
                ))}
            </ul>
        );
    }
}


//react18  createRoot 代替了 ReactDom.render
const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
    <React.StrictMode>
       <h1>hello world</h1>
       <Select 
        values={["State.", "Should.", "Be.", "Synchronous."]} 
        onSelect={(value) => console.log(value)} 
       />
    </React.StrictMode>
);
