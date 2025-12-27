import { useEffect, useState } from "react";
import type { Table } from "../../types/tables";
import {
   getTables,
   generateTableQR,
   updateTableStatus,
   regenerateAllTableQR,
} from "../../api/admin/tables";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import StatsCard from "../../components/tables/StatsCard";
import TablesGrid from "../../components/tables/TablesGrid";
import QRCodeModal from "../../components/tables/QRCodeModal";
import TableForm from "../../components/tables/TableForm";
import { createTable, updateTable } from "../../api/admin/tables";

const Tables = () => {
   const [tables, setTables] = useState<Table[]>([]);
   const [loading, setLoading] = useState(false);
   const [openForm, setOpenForm] = useState(false);
   const [editingTable, setEditingTable] = useState<Table | null>(null);

   const [qrData, setQrData] = useState<{
      tableId: string;
      tableName: string;
      capacity?: number;
      location?: string;
      qrUrl: string;
      createdAt?: string;
      scansToday?: number;
   } | null>(null);

   const fetchTables = async () => {
      try {
         setLoading(true);
         const data = await getTables();
         setTables(data);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchTables();
   }, []);

   const handleGenerateQR = async (table: Table) => {
      const res = await generateTableQR(table.id);

      setQrData({
         tableId: table.id,
         tableName: table.tableNumber,
         capacity: table.capacity,
         location: table.location,
         qrUrl: res.qrUrl,
         createdAt: res.createdAt,
      });
   };

   const handleRegenerateQR = async (tableId: string) => {
      const res = await generateTableQR(tableId);
      setQrData((prev) =>
         prev
            ? {
                 ...prev,
                 qrUrl: res.qrUrl,
                 createdAt: res.createdAt,
              }
            : null
      );
   };

   const handleToggleStatus = async (table: Table) => {
      const newStatus = table.status === "active" ? "inactive" : "active";
      await updateTableStatus(table.id, newStatus);
      fetchTables();
   };

   const handleEdit = (table: Table) => {
      setEditingTable(table);
      setOpenForm(true);
   };

   const handleSubmitTable = async (data: Partial<Table>) => {
      try {
         if (editingTable) {
            await updateTable(editingTable.id, data);
         } else {
            await createTable(data);
         }

         await fetchTables();
      } catch (err) {
         throw err;
      }
   };

   const handleDownloadAllQR = async () => {
      const zip = new JSZip();
      const activeTables = tables.filter((t) => t.status === "active");

      for (const table of activeTables) {
         const res = await generateTableQR(table.id);

         const blob = await (await fetch(res.qrUrl)).blob();
         zip.file(`table-${table.tableNumber}-qr.png`, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "all-active-tables.zip");
   };

   const handleRegenerateAllQR = async () => {
      if (
         !confirm(
            "Regenerate QR codes for all active tables? Old codes will be invalid."
         )
      ) {
         return;
      }

      try {
         const result = await regenerateAllTableQR();
         alert(
            `Successfully regenerated QR codes for ${result.affected} tables`
         );
         await fetchTables();
      } catch (error) {
         alert("Failed to regenerate QR codes");
         console.error(error);
      }
   };

   const total = tables.length;
   const active = tables.filter((t) => t.status === "active").length;
   const inactive = tables.filter((t) => t.status === "inactive").length;

   return (
      <div className="p-6 space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-3xl font-bold">Table Management</h1>
               <p className="text-gray-500">
                  Manage tables & generate QR codes
               </p>
            </div>

            <button
               onClick={() => setOpenForm(true)}
               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
               + Add Table
            </button>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard label="Total Tables" value={total} variant="total" />
            <StatsCard label="Active" value={active} variant="active" />
            <StatsCard label="Inactive" value={inactive} variant="inactive" />
         </div>

         <div className="bg-white p-6 rounded shadow space-y-4">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-bold">All Tables</h3>

               <div className="flex gap-2">
                  <button
                     onClick={handleDownloadAllQR}
                     className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                     Download All QR Codes
                  </button>
                  <button
                     onClick={handleRegenerateAllQR}
                     className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  >
                     Regenerate All QR
                  </button>
               </div>
            </div>

            {loading ? (
               <div className="text-gray-500">Loading tables...</div>
            ) : (
               <TablesGrid
                  tables={tables}
                  onGenerateQR={handleGenerateQR}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
               />
            )}
         </div>

         {qrData && (
            <QRCodeModal
               open
               onClose={() => setQrData(null)}
               tableId={qrData.tableId}
               tableName={qrData.tableName}
               capacity={qrData.capacity}
               location={qrData.location}
               qrUrl={qrData.qrUrl}
               createdAt={qrData.createdAt}
               scansToday={qrData.scansToday}
               onRegenerate={handleRegenerateQR}
            />
         )}

         <TableForm
            open={openForm}
            onClose={() => {
               setOpenForm(false);
               setEditingTable(null);
            }}
            onSubmit={handleSubmitTable}
            existingTables={tables}
            initialData={editingTable ?? undefined}
         />
      </div>
   );
};

export default Tables;
