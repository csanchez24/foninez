import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dictionary } from '@/i18n/get-dictionary';
import type { DashboardResponse } from '@/server/api/types';
import React, { PureComponent } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: DashboardResponse['statusChart'];
  dictionary: Dictionary['dashboard'];
};

export default class ActivitiesStatusChart extends PureComponent<Props> {
  render() {
    return (
      <Card className="rounded-md p-0">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center justify-between">
            <p className="text-sm font-medium tracking-tight">
              {this.props.dictionary.ActivitiesStatusChart.title}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-72 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={this.props.data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="status" />
              <PolarRadiusAxis />
              <Radar
                name="Status"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }
}
