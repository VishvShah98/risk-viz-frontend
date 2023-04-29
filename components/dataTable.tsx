import { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useSnapshot } from 'valtio';
import state from '../state';

function DataTable() {
  const [rows, setRows] = useState<Array<any>>([]);
  const [assetNameFilterValue, setAssetNameFilterValue] = useState<string>('');
  const { palette } = useTheme();
  const snapshot = useSnapshot(state);

  function formatRiskFactors(riskFactorsStr: string): string {
    const riskFactors = JSON.parse(riskFactorsStr);
    const formattedRiskFactors = Object.entries(riskFactors)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    return formattedRiskFactors;
  }

  useEffect(() => {
    const dataRows = state.data.map((data: any) => ({
      id: data._id,
      assetName: data['Asset Name'],
      businessCategory: data['Business Category'],
      riskFactors: formatRiskFactors(data['Risk Factors']),
      riskRating: data['Risk Rating'],
    }));

    setRows(dataRows);
  }, [snapshot.data]);

  // useEffect(() => {
  //   state.graphData[0]['Asset Name']
  //   setAssetNameFilterValue(state.tabelFilter);
  //   console.log('table',state.graphData[0]['Asset Name']);
  // }, [snapshot.graphData]);

  const columns: GridColDef[] = [
    { field: 'assetName', headerName: 'Asset Name', width: 220 },
    { field: 'businessCategory', headerName: 'Business Category', width: 155 },
    { field: 'riskFactors', headerName: 'Risk Factors', width: 660 },
    { field: 'riskRating', headerName: 'Risk Rating', width: 150 },
  ];



  return (
    <Box className="data-table" sx={{
      height: 400,
      borderRadius: "1rem",
      boxShadow: "0.15rem 0.2rem 0.15rem 0.1rem rgba(0, 0, 0, .8)",
      '.MuiDataGrid-columnHeaderTitle': { fontSize: 15, fontWeight: 'bolder !important' },

      "& .MuiDataGrid-cell": {
        borderBottom: `1px solid ${palette.grey[800]} !important`,
      },
      "& .MuiDataGrid-columnHeaders": {
        borderBottom: `2px solid ${palette.grey[800]} !important`,
      },

    }} >
      <DataGrid
        sx={{ backgroundColor: 'white', color: 'black' }}
        rows={rows}
        columns={columns}
        columnHeaderHeight={80}
        rowHeight={50}
        filterModel={{
          items: [
            {
              field: 'assetName', operator: 'contains', value: state.tabelFilter
            }
          ]
        }}
      />
    </Box>
  );
}

export default DataTable;
