import React, { Component } from "react"
import Styled from "styled-components"
import { Container, Header } from "semantic-ui-react"

import MultiSelect from "./../../components/inputs/MultiSelect"
import PaginationMenu from "./PaginationMenu"
import ResultOrder from "./ResultOrder"
import DateRangePicker from "./../../components/inputs/DateRangePicker" // افترضنا وجود هذا المكون
import { constants } from "./../../constants"

const { languages, labels } = constants.search_filters

const FilterTitle = Styled(Header.Subheader)`
  margin: 0.33em 0;
`

class IssueFilters extends Component {
  componentDidMount() {
    const {
      selectedLanguages,
      selectedLabels,
      selectedPage,
      selectedPerPage,
      selectedSort,
      selectedOrder,
      selectedStartDate,
      selectedEndDate,
      location
    } = this.props

    let query_filters = {
      languages: selectedLanguages,
      labels: selectedLabels,
      page: selectedPage,
      per_page: selectedPerPage,
      sort: selectedSort,
      order: selectedOrder,
      start_date: selectedStartDate,
      end_date: selectedEndDate
    }

    if (location.search) {
      // Set initial state from URL params
      const parsed = new URLSearchParams(location.search)
      query_filters = {
        ...query_filters,
        languages: (parsed.get("languages") || "").split(","),
        labels: (parsed.get("labels") || "").split(","),
        page: Number.parseInt(parsed.get("page")),
        sort: parsed.get("sort"),
        order: parsed.get("order"),
        start_date: parsed.get("start_date"),
        end_date: parsed.get("end_date")
      }
    }

    // load api results with default filters
    this.props.onInitialMount(query_filters)
  }

  render() {
    const {
      selectedLanguages,
      selectedLabels,
      onLanguageSelect,
      onLabelSelect,
      selectedPage,
      selectedPerPage,
      onPageSelect,
      selectedSort,
      selectedOrder,
      selectedSortOrder,
      onSortOrderSelect,
      selectedStartDate,
      selectedEndDate,
      onStartDateSelect,
      onEndDateSelect,
      totalResults,
      children
    } = this.props

    return (
      <Container>
        <Header size="medium">
          <Header.Content>Narrow your Search</Header.Content>
        </Header>
        
        <FilterTitle>Languages</FilterTitle>
        <MultiSelect
          style={{ marginBottom: "4px" }}
          placeholder="Filter by Language"
          options={languages}
          value={selectedLanguages}
          onChange={values => {
            onLanguageSelect({
              languages: values,
              labels: selectedLabels,
              page: 1,
              per_page: selectedPerPage,
              sort: selectedSort,
              order: selectedOrder,
              start_date: selectedStartDate,
              end_date: selectedEndDate
            })
          }}
        />
        
        <FilterTitle>Labels</FilterTitle>
        <MultiSelect
          style={{ marginBottom: "4px" }}
          placeholder="Filter by Label"
          options={labels}
          value={selectedLabels}
          onChange={values => {
            onLabelSelect({
              languages: selectedLanguages,
              labels: values,
              page: 1,
              per_page: selectedPerPage,
              sort: selectedSort,
              order: selectedOrder,
              start_date: selectedStartDate,
              end_date: selectedEndDate
            })
          }}
        />

        <FilterTitle>Date Range</FilterTitle>
        <DateRangePicker
          startDate={selectedStartDate}
          endDate={selectedEndDate}
          onChange={({ startDate, endDate }) => {
            onStartDateSelect(startDate)
            onEndDateSelect(endDate)
          }}
        />
        
        <ResultOrder
          value={selectedSortOrder}
          onChange={value => {
            const parsed = new URLSearchParams(value)
            onSortOrderSelect({
              languages: selectedLanguages,
              labels: selectedLabels,
              page: 1,
              per_page: selectedPerPage,
              sort: parsed.get("sort"),
              order: parsed.get("order"),
              start_date: selectedStartDate,
              end_date: selectedEndDate
            })
          }}
        />
        
        {children}

        <PaginationMenu
          selectedPage={selectedPage}
          selectedPerPage={selectedPerPage}
          totalResults={totalResults}
          onChange={value => {
            onPageSelect({
              languages: selectedLanguages,
              labels: selectedLabels,
              page: value,
              per_page: selectedPerPage,
              sort: selectedSort,
              order: selectedOrder,
              start_date: selectedStartDate,
              end_date: selectedEndDate
            })
          }}
        />
      </Container>
    )
  }
}

export default IssueFilters
