import React, {useEffect} from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CListGroup,
    CListGroupItem,
    CPopover,
    CProgress,
    CProgressBar
} from "@coreui/react";

import {connect} from 'react-redux'
import {actions} from "../store";

import {AxiosInstance} from "../AxiosUtil";

const ONE_DAY_IN_MILLISECONDS = 60 * 60 * 24 * 1000

const PlaceView = ({reloadPlace, placeName, users, match}) => {
    useEffect(() => {
        if (!placeName) {
            AxiosInstance.get(`/place/${match.params.id}/${match.params.date}`).then(r => {
                reloadPlace(r.data)
            })
        }
    }, [])

    const userListView = users ? (
        <CListGroup>
            {
                Object.keys(users).map((key) => {
                    const {name = "", stayPeriodList = []} = users[key]
                    const periods = []
                    const now = new Date()
                    const startTime = new Date(stayPeriodList[0].startTime)
                    startTime.setHours(0, 0, 0, 0)
                    const nextDate = new Date(startTime.getTime() + ONE_DAY_IN_MILLISECONDS)
                    const endDate = nextDate.getTime() < now.getTime() ? nextDate : now
                    periods.push(new Date(startTime))
                    for (let element of stayPeriodList) {
                        periods.push(new Date(element.startTime))
                        periods.push(element.endTime ? new Date(element.endTime) : endDate)
                    }
                    return (
                        <CListGroupItem key={key}>
                            {name}
                            <CProgress>
                                {
                                    periods.map((period, idx) => {
                                        if (idx === periods.length - 1) return null
                                        console.log(periods[idx + 1].toLocaleString())
                                        const baseProgress = (
                                            <CProgressBar color={idx % 2 === 0 ? "secondary" : "primary"}
                                                          value={(periods[idx + 1].getTime() - period.getTime()) / ONE_DAY_IN_MILLISECONDS * 100}
                                                          showPercentage={idx % 2 === 1} key={idx}/>
                                        )
                                        return idx % 2 === 1 ? (
                                            <CPopover header={name}
                                                      content={`In Time : ${period.toLocaleTimeString()} Out Time : ${periods[idx + 1].toLocaleTimeString()}`}
                                                      placement="bottom"
                                                      interactive
                                                      trigger="click"
                                                      key={period.getTime()}
                                            >
                                                {baseProgress}
                                            </CPopover>
                                        ) : baseProgress
                                    })
                                }
                                <CProgressBar color="secondary"
                                              value={(endDate.getTime() - periods[periods.length - 1].getTime()) / ONE_DAY_IN_MILLISECONDS * 100}/>
                            </CProgress>
                        </CListGroupItem>
                    )
                })
            }
        </CListGroup>
    ) : null

    return placeName ? (
        <CCol xs={12} className="d-flex justify-content-center align-items-center">
            <CCard className="w-100">
                <CCardHeader>{placeName}</CCardHeader>
                <CCardBody>
                    {userListView}
                </CCardBody>
            </CCard>
        </CCol>
    ) : null
}

const mapStateToProps = (state, ownProps) => {
    const {places = []} = state
    let place
    for (let element of places) {
        if (element.placeID === Number(ownProps.match.params.id)) {
            place = element;
            break
        }
    }
    console.log(place)
    return place ? {
        ...place,
        ...ownProps
    } : {...ownProps}
}

const mapDispatchToProps = (dispatch) => {
    return {
        reloadPlace: (result) => {
            dispatch({type: actions.place, ...result})
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceView)