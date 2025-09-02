import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { DashboardResponse } from '@/server/api/types';
import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: DashboardResponse['activityMonthly'];
  dictionary: Dictionary['dashboard'];
};

export default class ActivitiesMonthlyChart extends PureComponent<Props> {
  render() {
    return (
      <Card className="rounded-md p-0">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-tight">
              {this.props.dictionary.ActivitiesMonthlyChart.title}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={this.props.data}
              margin={{
                top: 20,
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
              <Bar dataKey="value1" name="planeadas" fill="#8884d8" />
              <Bar dataKey="value2" name="ejecutadas" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}
