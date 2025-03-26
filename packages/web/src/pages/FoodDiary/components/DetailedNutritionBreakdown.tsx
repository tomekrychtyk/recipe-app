import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { VITAMINS_RDA, MINERALS_RDA } from "@food-recipe-app/common";
import type { FoodDiaryEntryResponse } from "../types";
import { calculateDetailedNutrition } from "../utils";

interface Props {
  entries: FoodDiaryEntryResponse[];
}

export function DetailedNutritionBreakdown({ entries }: Props) {
  if (entries.length === 0) return null;

  const nutrition = calculateDetailedNutrition(entries);
  const vitamins = [
    ["vitaminA", "Witamina A", nutrition.vitaminA, "µg"],
    ["vitaminD", "Witamina D", nutrition.vitaminD, "µg"],
    ["vitaminE", "Witamina E", nutrition.vitaminE, "mg"],
    ["vitaminK", "Witamina K", nutrition.vitaminK, "µg"],
    ["vitaminC", "Witamina C", nutrition.vitaminC, "mg"],
    ["thiamin", "Tiamina (B1)", nutrition.thiamin, "mg"],
    ["riboflavin", "Ryboflawina (B2)", nutrition.riboflavin, "mg"],
    ["niacin", "Niacyna (B3)", nutrition.niacin, "mg"],
    [
      "pantothenicAcid",
      "Kwas pantotenowy (B5)",
      nutrition.pantothenicAcid,
      "mg",
    ],
    ["vitaminB6", "Witamina B6", nutrition.vitaminB6, "mg"],
    ["biotin", "Biotyna (B7)", nutrition.biotin, "µg"],
    ["folate", "Kwas foliowy (B9)", nutrition.folate, "µg"],
    ["vitaminB12", "Witamina B12", nutrition.vitaminB12, "µg"],
  ];

  const minerals = [
    ["calcium", "Wapń", nutrition.calcium, "mg"],
    ["iron", "Żelazo", nutrition.iron, "mg"],
    ["magnesium", "Magnez", nutrition.magnesium, "mg"],
    ["phosphorus", "Fosfor", nutrition.phosphorus, "mg"],
    ["potassium", "Potas", nutrition.potassium, "mg"],
    ["sodium", "Sód", nutrition.sodium, "mg"],
    ["zinc", "Cynk", nutrition.zinc, "mg"],
    ["copper", "Miedź", nutrition.copper, "mg"],
    ["manganese", "Mangan", nutrition.manganese, "mg"],
    ["selenium", "Selen", nutrition.selenium, "µg"],
    ["chromium", "Chrom", nutrition.chromium, "µg"],
    ["molybdenum", "Molibden", nutrition.molybdenum, "µg"],
    ["iodine", "Jod", nutrition.iodine, "µg"],
  ];

  const calculateRdaPercentage = (
    key: keyof typeof VITAMINS_RDA | keyof typeof MINERALS_RDA,
    value: number | undefined,
    type: "vitamin" | "mineral"
  ): number => {
    if (value === undefined || typeof value !== "number" || isNaN(value))
      return 0;

    const rda =
      type === "vitamin"
        ? VITAMINS_RDA[key as keyof typeof VITAMINS_RDA]?.value
        : MINERALS_RDA[key as keyof typeof MINERALS_RDA]?.value;

    if (!rda) return 0;
    return Math.round((value / rda) * 100);
  };

  const maxRows = Math.max(vitamins.length, minerals.length);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ bgcolor: "background.paper" }}
      >
        <Typography variant="h6">
          Szczegółowe informacje o wartościach odżywczych
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Witaminy</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Ilość
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  % RDA
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", pl: 4 }}>
                  Minerały
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Ilość
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  % RDA
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: maxRows }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>{vitamins[i]?.[1] || ""}</TableCell>
                  <TableCell align="right">
                    {vitamins[i]
                      ? `${Number(vitamins[i][2]) || 0} ${vitamins[i][3]}`
                      : ""}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: vitamins[i]
                        ? calculateRdaPercentage(
                            vitamins[i][0] as keyof typeof VITAMINS_RDA,
                            Number(vitamins[i][2]),
                            "vitamin"
                          ) >= 100
                          ? "success.main"
                          : "text.primary"
                        : "text.primary",
                    }}
                  >
                    {vitamins[i]
                      ? `${calculateRdaPercentage(
                          vitamins[i][0] as keyof typeof VITAMINS_RDA,
                          Number(vitamins[i][2]),
                          "vitamin"
                        )}%`
                      : ""}
                  </TableCell>
                  <TableCell sx={{ pl: 4 }}>{minerals[i]?.[1] || ""}</TableCell>
                  <TableCell align="right">
                    {minerals[i]
                      ? `${Number(minerals[i][2]) || 0} ${minerals[i][3]}`
                      : ""}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: minerals[i]
                        ? calculateRdaPercentage(
                            minerals[i][0] as keyof typeof MINERALS_RDA,
                            Number(minerals[i][2]),
                            "mineral"
                          ) >= 100
                          ? "success.main"
                          : "text.primary"
                        : "text.primary",
                    }}
                  >
                    {minerals[i]
                      ? `${calculateRdaPercentage(
                          minerals[i][0] as keyof typeof MINERALS_RDA,
                          Number(minerals[i][2]),
                          "mineral"
                        )}%`
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
