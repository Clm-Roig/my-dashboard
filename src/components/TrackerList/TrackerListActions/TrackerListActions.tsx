import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DeselectIcon from '@mui/icons-material/Deselect';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import SortIcon from '@mui/icons-material/Sort';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { VariantType, useSnackbar } from 'notistack';
import { FC, useState } from 'react';

import { useAppDispatch } from '../../../app/hooks';
import Tracker from '../../../models/Tracker';
import TrackerStatus from '../../../models/TrackerStatus';
import {
  archiveTrackers,
  deleteTrackers,
  unarchiveTrackers
} from '../../../store/trackers/trackersSlice';
import Order from '../Order';

interface Props {
  order: Order;
  setOrder: (order: Order) => void;
  selectedTrackers: Tracker[];
  setSelectedTrackers: (trackers: Tracker[]) => void;
  trackers: Tracker[];
}

const TrackerListActions: FC<Props> = ({
  order,
  selectedTrackers,
  setOrder,
  setSelectedTrackers,
  trackers
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const displayMenu = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const atLeastOneSelectedArchived = selectedTrackers.some(
    (t) => t.status === TrackerStatus.archived
  );

  const allSelectedArchived = selectedTrackers.every((t) => t.status === TrackerStatus.archived);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const afterAction = () => {
    handleMenuClose();
    setSelectedTrackers([]);
  };

  const handleAction = (
    action: ActionCreatorWithPayload<string[], string>,
    adjective: string,
    variant: VariantType
  ) => {
    dispatch(action(selectedTrackers.map((t) => t.id)));
    const plural = selectedTrackers.length > 1 ? 's' : '';
    enqueueSnackbar('Tracker' + plural + ' ' + adjective + plural + ' !', { variant: variant });
    afterAction();
  };

  const handleDeleteTrackers = () => {
    handleAction(deleteTrackers, 'supprimé', 'info');
  };

  const handleArchiveTrackers = () => {
    handleAction(archiveTrackers, 'archivé', 'success');
  };

  const handleUnrchiveTrackers = () => {
    handleAction(unarchiveTrackers, 'désarchivé', 'success');
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography>
          <b>{selectedTrackers.length}</b> sélectionné{selectedTrackers.length > 1 ? 's' : ''}
        </Typography>
      </Box>
      <Box>
        <IconButton onClick={() => setOrder(order === Order.asc ? Order.desc : Order.asc)}>
          <SortIcon sx={{ transform: `rotateX(${order === Order.asc ? '180deg' : '0'})` }} />
        </IconButton>

        {selectedTrackers.length === trackers.length ? (
          <IconButton onClick={() => setSelectedTrackers([])}>
            <DeselectIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => setSelectedTrackers(trackers)}>
            <SelectAllIcon />
          </IconButton>
        )}
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="basic-menu"
          open={displayMenu}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}>
          <MenuItem onClick={handleDeleteTrackers} disabled={selectedTrackers.length === 0}>
            <DeleteForeverIcon />
            &nbsp; Supprimer
          </MenuItem>
          <Tooltip
            arrow
            title={
              selectedTrackers.length === 0 || !atLeastOneSelectedArchived
                ? ''
                : 'Vous ne pouvez pas archiver un tracker déjà archivé.'
            }>
            <span>
              <MenuItem
                onClick={handleArchiveTrackers}
                disabled={
                  selectedTrackers.length === 0 || atLeastOneSelectedArchived // You can't archive a tracker already archived
                }>
                <ArchiveIcon />
                &nbsp; Archiver
              </MenuItem>
            </span>
          </Tooltip>
          <Tooltip
            arrow
            title={
              selectedTrackers.length === 0 || allSelectedArchived
                ? ''
                : 'Vous ne pouvez pas désarchiver un tracker non-archivé.'
            }>
            <span>
              <MenuItem
                onClick={handleUnrchiveTrackers}
                disabled={
                  selectedTrackers.length === 0 || !allSelectedArchived // You can't unarchive a tracker already unarchived
                }>
                <UnarchiveIcon />
                &nbsp; Désarchiver
              </MenuItem>
            </span>
          </Tooltip>
        </Menu>
      </Box>
    </Box>
  );
};

export default TrackerListActions;
