import { DatePicker } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import { endOfYear, startOfYear } from 'date-fns';
import { FC } from 'react';

import { useAppSelector } from '../../../app/hooks';
import { TRACKERS_BEGIN_IN } from '../../../config/Constants';
import Tracker from '../../../models/Tracker';
import { selectYearEntries } from '../../../store/trackers/trackers.selectors';
import { getAggregatedCompletions } from '../../../store/trackers/utils';
import YearChart from '../../charts/YearChart/YearChart';
import TotalText from './TotalText';

interface Props {
  beginDate: Date;
  setBeginDate: (date: Date) => void;
  tracker: Tracker;
}

const YearPanel: FC<Props> = ({ beginDate, setBeginDate, tracker }) => {
  const monthEntries = useAppSelector((state) => selectYearEntries(state, beginDate, tracker.id));

  const handleOnYearChange = (date: unknown) => {
    if (date) setBeginDate(startOfYear(date as Date));
  };

  return (
    <>
      <Box sx={{ mb: 1 }}>
        <DatePicker
          views={['year']}
          disableFuture
          maxDate={endOfYear(new Date())}
          minDate={TRACKERS_BEGIN_IN}
          onChange={handleOnYearChange}
          value={beginDate}
          renderInput={(params) => <TextField sx={{ width: '100%' }} {...params} />}
        />
      </Box>
      <Box sx={{ mb: 1 }}>
        <TotalText completions={getAggregatedCompletions(monthEntries)} />
      </Box>
      {monthEntries.length > 0 && <YearChart beginDate={beginDate} entries={monthEntries} />}
    </>
  );
};

export default YearPanel;
