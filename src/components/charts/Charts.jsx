import { onCleanup, onMount, createEffect } from "solid-js";
import { Chart } from "chart.js/auto";

function Charts(props) {
  let canvasRef;
  let chart;

  onMount(() => {
    const ctx = canvasRef.getContext("2d");

    // Определяем наборы данных
    const datasets = [
      {
        label: "Credit body",
        categoryPercentage: 1,
        data: props.data.map((item) => item[0][0]), // Основной долг для обычных платежей
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 0,
        stack: "stack1", // Первая группа
      },
      {
        label: "Percents",
        categoryPercentage: 1,
        data: props.data.map((item) => item[0][1]), // Проценты для обычных платежей
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 0,
        stack: "stack1", // Первая группа
      },
    ];

    if (props.isEarlyPaymentEnabled) {
      datasets.push({
        label: "EP Credit body",
        categoryPercentage: 1,
        data: props.data.map((item) => item[1][0]),
        backgroundColor: "rgba(103, 178, 116, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 0,
        stack: "stack2"
      });
      datasets.push({
        label: "EP Percents",
        categoryPercentage: 1,
        data: props.data.map((item) => item[1][1]),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 0,
        stack: "stack2"
      });
    }

    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: props.labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true, // Не суммировать значения в стеке
            grid: {
              display: false, // Скрыть сетку
            },
            ticks: {
              autoSkip: true, // Чтобы все метки отображались
              maxRotation: 180, // Поворот меток для лучшего отображения
              minRotation: 0,
            },
            // barPercentage: 50, // Ширина столбцов
            // categoryPercentage: 50, // Ширина групп столбцов
          },
          y: {
            stacked: true, // Не суммировать значения в стеке
            beginAtZero: true, // Начинать ось y с нуля
          }
        },
        
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        layout: {
          padding: 0,
        },
      },
    });

    onCleanup(() => {
      chart.destroy();
    });
  });

  createEffect(() => {
    if (chart) {
      chart.data.labels = props.labels;
      chart.data.datasets[0].data = props.data.map((item) => item[0][0]); // Основной долг для обычных платежей
      chart.data.datasets[1].data = props.data.map((item) => item[0][1]); // Проценты для обычных платежей
      if (props.isEarlyPaymentEnabled) {
        if (chart.data.datasets.length > 2) {
          chart.data.datasets[2].data = props.data.map(
            (item) => item[1][0] || 0
          ); // Основной долг для досрочных платежей
          chart.data.datasets[3].data = props.data.map(
            (item) => item[1][1] || 0
          ); // Проценты для досрочных платежей
        } else {
          chart.data.datasets.push({
            label: "EP Credit body",
            categoryPercentage: 1,
            data: props.data.map((item) => item[1][0] || 0),
            backgroundColor: "rgba(103, 178, 116, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 0,
            stack: "stack2"
          });
          chart.data.datasets.push({
            label: "EP Percents",
            categoryPercentage: 1,
            data: props.data.map((item) => item[1][1] || 0),
            backgroundColor: "rgba(255, 159, 64, 0.6)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 0,
            stack: "stack2"
          });
        }
      } else {
        console.log("EP disabled");
        if (chart.data.datasets.length > 2) {
          delete chart.data.datasets.pop();
          delete chart.data.datasets.pop();
        }
      }
      chart.update(); // Обновляем график
    }
  });

  return (
    <div style={{ width: "80vw", height: "60vh" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default Charts;
