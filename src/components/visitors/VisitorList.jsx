"use client"

import React from "react"
import { Check, X, Clock, QrCode, LogOut, Calendar, AlertTriangle, LogIn } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import useStore from "../../store/useStore"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VisitorList({ visitors }) {
  const [selectedRecord, setSelectedRecord] = React.useState(null)
  const [showQRCode, setShowQRCode] = React.useState(false)
  const updateVisitorStatus = useStore((state) => state.updateVisitorStatus)
  const checkoutVisitor = useStore((state) => state.checkoutVisitor)
  const checkinPreApproval = useStore((state) => state.checkinPreApproval)
  const checkoutPreApproval = useStore((state) => state.checkoutPreApproval)
  const user = useStore((state) => state.user)

  const handleApprove = (visitorId) => {
    updateVisitorStatus(visitorId, "approved")
  }

  const handleReject = (visitorId) => {
    updateVisitorStatus(visitorId, "rejected")
  }

  const handleCheckout = (visitorId) => {
    checkoutVisitor(visitorId)
  }

  const handlePreApprovalCheckin = (preApprovalId) => {
    checkinPreApproval(preApprovalId)
  }

  const handlePreApprovalCheckout = (preApprovalId) => {
    checkoutPreApproval(preApprovalId)
  }

  const openDetails = (record) => {
    setSelectedRecord(record)
    setShowQRCode(false)
  }

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode)
  }

  const isVisitor = (record) => "fullName" in record

  const isPreApprovalLate = (record) => {
    const now = new Date()
    const startTime = new Date(record.startTime)
    return now > startTime && record.status === "active"
  }

  const isPreApprovalActive = (record) => {
    const now = new Date()
    const startTime = new Date(record.startTime)
    const endTime = new Date(record.endTime)
    return now >= startTime && now <= endTime && (record.status === "active" || record.status === "checked-in")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
      case "checked-in":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "checked-out":
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "expired":
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "used":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "checked-in":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      case "checked-out":
      case "completed":
        return <LogOut className="h-4 w-4" />
      case "active":
        return <Calendar className="h-4 w-4" />
      case "late":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getQRCodeData = (record) => {
    if (isVisitor(record)) {
      return {
        id: record.id,
        type: "visitor",
        name: record.fullName,
        checkInTime: record.checkInTime,
        hostEmployee: record.hostEmployee,
      }
    } else {
      return {
        id: record.id,
        type: "pre-approved",
        name: record.visitorName,
        email: record.visitorEmail,
        startTime: record.startTime,
        endTime: record.endTime,
        hostEmployee: record.hostEmployee,
      }
    }
  }

  const getPreApprovalStatus = (record) => {
    if (record.status === "used") return "completed"
    if (record.status === "checked-in") return "checked-in"
    if (isPreApprovalLate(record)) return "late"
    return record.status
  }

  const renderDetailModal = () => {
    if (!selectedRecord) return null
    const status = isVisitor(selectedRecord) ? selectedRecord.status : getPreApprovalStatus(selectedRecord)
    const canShowQR =
      (isVisitor(selectedRecord) && selectedRecord.status === "approved") ||
      (!isVisitor(selectedRecord) && isPreApprovalActive(selectedRecord))

    return (
      <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>
              {isVisitor(selectedRecord) ? selectedRecord.fullName : selectedRecord.visitorName}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Avatar className="h-20 w-20 col-span-1">
                <AvatarImage src={selectedRecord.photoUrl} alt="Visitor" />
                <AvatarFallback>
                  {isVisitor(selectedRecord) ? selectedRecord.fullName.charAt(0) : selectedRecord.visitorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="col-span-3">
                <h3 className="text-lg font-semibold">
                  {isVisitor(selectedRecord) ? selectedRecord.fullName : selectedRecord.visitorName}
                </h3>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {getStatusIcon(status)}
                  <span className="ml-1">{status}</span>
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{isVisitor(selectedRecord) ? selectedRecord.email : selectedRecord.visitorEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{isVisitor(selectedRecord) ? selectedRecord.phone : selectedRecord.visitorPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Host</p>
                <p>{selectedRecord.hostEmployee}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Purpose</p>
                <p>{selectedRecord.purpose}</p>
              </div>
              {isVisitor(selectedRecord) ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Check-in</p>
                    <p>
                      {selectedRecord.checkInTime
                        ? new Date(selectedRecord.checkInTime).toLocaleString()
                        : "Not checked in"}
                    </p>
                  </div>
                  {selectedRecord.checkOutTime && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Check-out</p>
                      <p>{new Date(selectedRecord.checkOutTime).toLocaleString()}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Time</p>
                    <p>{new Date(selectedRecord.startTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">End Time</p>
                    <p>{new Date(selectedRecord.endTime).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            {canShowQR && (
              <Button onClick={toggleQRCode} variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                {showQRCode ? "Hide QR Code" : "Show QR Code"}
              </Button>
            )}
            {isVisitor(selectedRecord) ? (
              <>
                {selectedRecord.hostEmployee.toLowerCase() === user?.toLowerCase() &&
                  selectedRecord.status === "pending" && (
                    <>
                      <Button onClick={() => handleApprove(selectedRecord.id)} variant="default">
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button onClick={() => handleReject(selectedRecord.id)} variant="destructive">
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </>
                  )}
                {selectedRecord.status === "approved" && (
                  <Button onClick={() => handleCheckout(selectedRecord.id)} variant="default">
                    <LogOut className="mr-2 h-4 w-4" />
                    Check-out
                  </Button>
                )}
              </>
            ) : (
              <>
                {isPreApprovalActive(selectedRecord) && (
                  <>
                    {selectedRecord.status === "active" && (
                      <Button onClick={() => handlePreApprovalCheckin(selectedRecord.id)} variant="default">
                        <LogIn className="mr-2 h-4 w-4" />
                        Check-in
                      </Button>
                    )}
                    {selectedRecord.status === "checked-in" && (
                      <Button onClick={() => handlePreApprovalCheckout(selectedRecord.id)} variant="default">
                        <LogOut className="mr-2 h-4 w-4" />
                        Check-out
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </DialogFooter>
          {showQRCode && (
            <div className="mt-6 flex flex-col items-center space-y-4 p-6 bg-gray-50 rounded-lg">
              <QRCodeSVG value={JSON.stringify(getQRCodeData(selectedRecord))} size={256} level="H" includeMargin />
              <p className="text-sm text-gray-600 text-center">Scan this QR code at the security desk for entry</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Visitor</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Host</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visitors.map((record) => {
            const status = isVisitor(record) ? record.status : getPreApprovalStatus(record)
            return (
              <TableRow key={record.id}>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.photoUrl} alt="Visitor" />
                      <AvatarFallback>
                        {isVisitor(record) ? record.fullName.charAt(0) : record.visitorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{isVisitor(record) ? record.fullName : record.visitorName}</div>
                      <div className="text-sm text-gray-500">
                        {isVisitor(record) ? record.companyName : record.visitorEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{record.purpose}</TableCell>
                <TableCell>{record.hostEmployee}</TableCell>
                <TableCell>
                  {isVisitor(record) ? (
                    <>
                      <div>
                        In: {record.checkInTime ? new Date(record.checkInTime).toLocaleString() : "Not checked in"}
                      </div>
                      <div>Out: {record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : "-"}</div>
                    </>
                  ) : (
                    <>
                      <div>Start: {new Date(record.startTime).toLocaleString()}</div>
                      <div>End: {new Date(record.endTime).toLocaleString()}</div>
                    </>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {getStatusIcon(status)}
                    <span className="ml-1">{status}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => openDetails(record)}>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {renderDetailModal()}
    </div>
  )
}

