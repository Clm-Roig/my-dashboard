import styled from '@emotion/styled';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, GridProps, IconButton, Typography, useTheme } from '@mui/material';
import { FC } from 'react';
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove
} from 'react-hook-form';

import { useAppSelector } from '../../../app/hooks';
import ThemeMode from '../../../models/ThemeMode';
import { selectThemeMode } from '../../../store/theme/theme.selectors';
import { FormValues } from '../TrackerForm/types';
import CompletionQuantityTextField from '../completions/CompletionQuantityTextField';
import CompletionUnitTextField from '../completions/CompletionUnitTextField';

export const FieldsetGrid = styled(Grid)`
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  padding: 8px;
`;

interface Props {
  append: UseFieldArrayAppend<FormValues, 'requiredCompletions'>;
  control: Control<FormValues, any> /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  fields: FieldArrayWithId<FormValues, 'requiredCompletions', 'id'>[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  getValues: (payload?: string | string[]) => FormValues;
  gridProps?: GridProps;
  remove: UseFieldArrayRemove;
}

/**
 * This forms is used to create one or many requiredCompletions for a new tracker.
 *
 * @param {*} { append, control, fields, gridProps, remove }
 * @return {*}
 */
const RequiredCompletionsForm: FC<Props> = ({
  append,
  control,
  fields,
  getValues,
  gridProps,
  remove
}) => {
  const themeMode = useAppSelector(selectThemeMode);
  const theme = useTheme();

  const fieldsetSx = {
    bgcolor: themeMode === ThemeMode.LIGHT ? theme.palette.grey[100] : theme.palette.grey[900],
    mb: 1
  };

  const uniqueUnit = (v: string) => {
    const requiredCompletions = getValues().requiredCompletions;
    const nbCompletions = requiredCompletions.filter((v2) => v2.unit === v);
    return nbCompletions.length < 2;
  };

  return (
    <>
      {fields.map((field, index) => (
        <FieldsetGrid columns={2} container key={field.id} sx={fieldsetSx} {...gridProps}>
          <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1">Objectif n°{index + 1}</Typography>
            <IconButton onClick={() => remove(index)} sx={{ p: 0 }}>
              <DeleteIcon color="error" />
            </IconButton>
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name={`requiredCompletions.${index}.quantity` as const}
              rules={{
                min: 0,
                pattern: /^\d+$/,
                required: true
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                let errorText = '';
                if (error) {
                  switch (error.type) {
                    case 'min':
                      errorText = 'La quantité doit être supérieure à 0.';
                      break;

                    case 'pattern':
                      errorText = 'La quantité doit être un nombre.';
                      break;

                    case 'required':
                      errorText = 'La quantité est requise';
                      break;
                  }
                }
                return (
                  <CompletionQuantityTextField
                    error={!!error}
                    helperText={error && errorText}
                    label={'Quantité'}
                    onChange={onChange}
                    required
                    size="small"
                    inputProps={{
                      style: {
                        textAlign: 'right'
                      }
                    }}
                    sx={{ mb: 1 }}
                    style={{}}
                    value={value || ''}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={1}>
            <Controller
              control={control}
              name={`requiredCompletions.${index}.unit` as const}
              rules={{
                required: true,
                validate: {
                  uniqueUnit
                }
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => {
                let errorText = '';
                if (error) {
                  switch (error.type) {
                    case 'uniqueUnit':
                      errorText = 'Les unités doivent toutes être différentes.';
                      break;

                    case 'required':
                      errorText = "L'unité est requise";
                      break;
                  }
                }
                return (
                  <CompletionUnitTextField
                    error={!!error}
                    helperText={error && errorText}
                    label={'Unité'}
                    onChange={onChange}
                    required
                    size="small"
                    sx={{ mb: 1 }}
                    value={value}
                  />
                );
              }}
            />
          </Grid>
        </FieldsetGrid>
      ))}
      <Button
        onClick={() => append({})}
        startIcon={<AddCircleOutlineIcon />}
        sx={{ mb: 2 }}
        variant="contained">
        Objectif
      </Button>
    </>
  );
};

export default RequiredCompletionsForm;
