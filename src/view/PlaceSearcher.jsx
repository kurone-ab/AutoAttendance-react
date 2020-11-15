import React, {useEffect, useState} from 'react'
import {
    CButton,
    CCol,
    CCollapse,
    CFormGroup,
    CInput,
    CListGroup,
    CListGroupItem,
    CModal,
    CModalBody,
    CModalHeader,
    CModalTitle,
    CRow,
    CSelect
} from "@coreui/react";
import {AxiosInstance} from "../AxiosUtil";
import {connect} from 'react-redux'
import Fuse from "fuse.js";

import {actions} from '../store'

const searchModes = [
    {id: "place", label: "장소", placeholder: "장소를 입력해주세요"},
    {id: "user", label: "사용자", placeholder: "사용자 이름을 입력해주세요"}
]

const initialState = {
    open: false,
    header: "검색 불가",
    content: `검색 조건을 충족하지 못했거나,
    조건을 만족하는 결과를 찾을 수 없습니다!`
}

const PlaceSearcher = ({search, updatePlaces, places = [], history}) => {
    const fuse = new Fuse(places, {
        keys: ['placeName']
    })

    const [searchMode, setSearchMode] = useState(searchModes[0])
    const [open, setOpen] = useState(false)
    const [searching, setSearching] = useState(false)
    const [searchingList, setSearchingList] = useState(places.map(place => {return {item: place}}))
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectedSearch = searchingList[selectedIndex]?.item

    useEffect(() => {
        AxiosInstance.get(`/place/list`).then(r => {
            updatePlaces(r.data)
        })
    }, [])

    const searchFromRestAPI = () => {
        const invalidSearchNodes = document.querySelectorAll('input:invalid')
        for (let invalidSearchNode of invalidSearchNodes) {
            console.log(invalidSearchNode.style.borderColor)
            invalidSearchNode.style.borderColor = 'red'
        }
        if (invalidSearchNodes.length > 0) {
            setOpen(true);
            return
        }
        const validSearchNodes = document.querySelectorAll('input:valid')
        for (let validSearchNode of validSearchNodes) {
            validSearchNode.style.borderColor = ''
        }

        if (!selectedSearch) {setOpen(true); return}

        const date = new Date(document.querySelector('#selectedDate').value)
        AxiosInstance.get(`/place/${selectedSearch.placeID}/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`).then(r => {
            search(r.data)
            history.push(`/place/${selectedSearch.placeID}/${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`)
        })
    }

    const changeSelectedIndex = evt => {
        switch (evt.keyCode) {
            case 13:
                evt.preventDefault()
                document.querySelector("#searchButton").click()
                break
            case 38:
                evt.preventDefault()
                setSelectedIndex(selectedIndex === 0 ? searchingList.length - 1 : selectedIndex - 1)
                break
            case 40:
                evt.preventDefault()
                setSelectedIndex(selectedIndex === searchingList.length - 1 ? 0 : selectedIndex + 1)
                break
            default: break
        }
    }

    return (
        <>
            <CCol xs={12}>
                <CFormGroup row className="my-3">
                    <CCol xs={2} className="d-flex justify-content-end align-items-center">
                        <CSelect id="searchMode"
                                 onChange={(evt) => setSearchMode(searchModes[evt.target.selectedIndex])}>
                            {
                                searchModes.map(value => {
                                    return (
                                        <option key={value.id}>{value.label}</option>
                                    )
                                })
                            }
                        </CSelect>
                    </CCol>
                    <CCol xs={3} className="d-flex justify-content-end align-items-center">
                        <CInput type="date" required id='selectedDate'/>
                    </CCol>
                    <CCol xs={5} className="d-flex justify-content-end align-items-center">
                        <CInput required placeholder={searchMode.placeholder} id='searchInput' autoComplete="off"
                                onFocus={() => setSearching(true)} onBlur={() => setSearching(false)}
                                onChange={evt => setSearchingList(fuse.search(evt.target.value))}
                                onKeyUp={changeSelectedIndex}
                        />
                    </CCol>
                    <CCol xs={2} className="d-flex justify-content-end align-items-center">
                        <CButton color="primary" onClick={searchFromRestAPI}
                                 className="w-100" id="searchButton">{`${searchMode.label} `}검색</CButton>
                    </CCol>
                </CFormGroup>
                <CRow className="mb-3">
                    <CCol xs={5}/>
                    <CCol xs={5}>
                        <CCollapse show={searching}>
                            <CListGroup accent>
                                {
                                    searchingList.map((item, idx) => {
                                        return (
                                            <CListGroupItem accent={idx === selectedIndex ? "primary" : "secondary"}
                                                            className="bg-white text-dark" key={idx}
                                            >{item.item?.placeName}</CListGroupItem>
                                        )
                                    })
                                }
                            </CListGroup>
                        </CCollapse>
                    </CCol>
                </CRow>
            </CCol>
            <CModal show={open} onClose={() => setOpen(!open)} color="danger">
                <CModalHeader closeButton>
                    <CModalTitle>{initialState.header}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {initialState.content}
                </CModalBody>
            </CModal>
        </>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        ...state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        search: (result) => {
            dispatch({type: actions.place, ...result})
        },
        updatePlaces: (result) => {
            dispatch({type: actions.placeList, result})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSearcher)