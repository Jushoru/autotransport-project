<script setup lang="ts">
import type {consigneeAnalyticsTypes} from "~/types/demoTablesTypes";
import {consigneeAnalyticsHeaders} from "~/config/demoTablesHeaders";
import {useDemoDbStore} from "~/stores/demoDbStore";
import {dateTimeFormat, timeDifference} from "~/utils/date&time";
import {sortByDatetime} from "~/utils/sort";
import {computed} from "vue";

const demoDbStore = useDemoDbStore()

const acceptedRequests = computed(() => {
  return demoDbStore.requests.filter((request) => request.status === 'accepted')
})

function getDeviationClass(deviation: string): string {
  if (!deviation) return '';

  const sign = deviation.startsWith('-') ? -1 : 1;
  const [hoursStr, minutesStr] = deviation.replace(/[+-]/, '').split(':');

  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  const totalMinutes = sign * (hours * 60 + minutes);

  if (totalMinutes > 90) return 'row--red';
  if (totalMinutes < -90) return 'row--green';

  return '';
}

const tableRows = computed<consigneeAnalyticsTypes[]>(() => {
  return sortByDatetime(acceptedRequests.value, "unload_datetime")
      .map(req => ({
        request_id: req.id,
        transport_company_name: 'OOO "' + demoDbStore.getTransportCompanyNameById(demoDbStore.getCurrentDriverById(req.driver_id)?.company_id) + '"',
        full_name: demoDbStore.getCurrentDriverById(req.driver_id)?.full_name ?? '-',
        product_name: req.product_name,
        unload_datetime: dateTimeFormat(req.unload_datetime),
        real_unload_datetime: dateTimeFormat(req.real_unload_datetime),
        plan_deviation: timeDifference(req.unload_datetime, req.real_unload_datetime),
      }));
});
</script>

<template>
  <div class="analytics">
    <table class="analytics__table table">
      <thead class="table__head">
      <tr>
        <th class="table__cell" v-for="field in consigneeAnalyticsHeaders">
          <p class="table__text table__header">
            {{ field.title }}
          </p>
        </th>
      </tr>
      </thead>
      <tbody>
      <tr class="table__row"
          v-for="row in tableRows"
          :key="row.request_id"
          :class="getDeviationClass(row.plan_deviation)"
      >
        <td class="table__cell" v-for="field in consigneeAnalyticsHeaders" :data-label="field.key">
          <p class="table__text">
            {{ row[field.key] }}
          </p>
        </td>
      </tr>
      </tbody>
    </table>

    <div class="analytics__mobile-table mobile-table">
      <div
          class="mobile-table__row"
          v-for="row in tableRows"
          :key="row.request_id"
          :class="getDeviationClass(row.plan_deviation)"
      >
        <div
            class="mobile-table__cell"
            v-for="field in consigneeAnalyticsHeaders"
            :key="field.key"
        >
          <p class="mobile-table__header">
            {{ field.title + ':'}}
          </p>

          <p class="mobile-table__text">
            {{ row[field.key] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table__header, .table__text, .mobile-table__header, .mobile-table__text {
  white-space: pre-line;
}
.table__text--bold {
  font-weight: 700;
}

.row--red {
  background-color: var(--demo-downtime-color);
}

.row--green {
  background-color: var(--demo-uptime-color);
}
</style>