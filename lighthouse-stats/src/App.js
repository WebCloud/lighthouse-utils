import React, { Component } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import tinycolor from 'tinycolor2';
import dayjs from 'dayjs';
import data from './data.json';

class App extends Component {
  render() {
    const baseColor = '#8884d8';
    // getting unique keys from all data set
    const lines = Object.keys(data.data.reduce((lines, item) => {
      const props = Object.keys(item).filter((prop) => prop !== 'date').reduce((obj, prop) => ({ ...obj, [prop]: prop }), {});
      return { ...lines, ...props };
    }, {}));

    const baseData = data.data.map((item) => ({ ...item, date: dayjs(item.date).format('dd DD/MM/YY')}))

    const Lines = lines.map((line, index) => line === 'total-weight'
      ? <Bar type="monotone" dataKey={line} fill={tinycolor(baseColor).spin((index || 1) * 250).lighten(5).toHexString()} />
      : <Line type="monotone" dataKey={line} stroke={tinycolor(baseColor).spin((index || 1) * 30).toHexString()} />
      );

    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
        <ComposedChart width={window.innerWidth * .9} height={window.innerHeight * .5} data={baseData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          {Lines}
        </ComposedChart>
      </div>
    );
  }
}

export default App;
