import type { DashboardResponse } from '@/server/api/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PureComponent } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Dictionary } from '@/i18n/get-dictionary';

type Props = {
  data: DashboardResponse['activityMonthly'];
  dictionary: Dictionary['dashboard'];
};

export default class RegisterMonthlyChart extends PureComponent<Props> {
  render() {
    return (
      <Card className="h-full rounded-md p-0">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-tight">
              {this.props.dictionary.RegisterMonthlyChart.title}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={this.props.data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value1"
                name="participantes"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="value2" name="registrados" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}
