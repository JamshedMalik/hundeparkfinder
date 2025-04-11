import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load the CSV file
csv_path = '/home/ubuntu/upload/google_de_hundepark-in-der-nähe_related-terms_2025-04-10_17-54-53.csv'
df = pd.read_csv(csv_path)

# Create output directory if it doesn't exist
output_dir = '/home/ubuntu/keyword_analysis'
os.makedirs(output_dir, exist_ok=True)

# Basic statistics and overview
print(f"Total keywords: {len(df)}")
print(f"Columns: {df.columns.tolist()}")

# Save basic statistics to file
with open(f"{output_dir}/basic_stats.txt", 'w') as f:
    f.write(f"Total keywords: {len(df)}\n")
    f.write(f"Columns: {df.columns.tolist()}\n\n")
    
    # Summary statistics for numeric columns
    f.write("Summary statistics for numeric columns:\n")
    f.write(df.describe().to_string())
    f.write("\n\n")
    
    # Count of keywords by intent
    if 'Intents' in df.columns:
        f.write("Keywords by intent:\n")
        intents = df['Intents'].str.split(',', expand=True).stack().str.strip()
        intent_counts = intents.value_counts()
        f.write(intent_counts.to_string())
        f.write("\n\n")

# Analyze search volume
df_sorted_by_volume = df.sort_values(by='Volume', ascending=False)
top_volume_keywords = df_sorted_by_volume.head(20)

# Save top keywords by volume
top_volume_keywords[['Keyword', 'Volume', 'CPC', 'Intents']].to_csv(f"{output_dir}/top_keywords_by_volume.csv", index=False)

# Analyze keywords by parent keyword
parent_keyword_counts = df['Parent Keyword'].value_counts()
top_parent_keywords = parent_keyword_counts.head(10)

# Save top parent keywords
with open(f"{output_dir}/top_parent_keywords.txt", 'w') as f:
    f.write("Top parent keywords:\n")
    f.write(top_parent_keywords.to_string())

# Keyword clustering by intent and location
def extract_intents_and_location(row):
    intents = row['Intents'].split(',') if isinstance(row['Intents'], str) else []
    intents = [intent.strip() for intent in intents]
    
    is_local = 'Local' in intents
    is_informational = 'Informational' in intents
    is_commercial = 'Commercial' in intents or 'Transactional' in intents
    
    return pd.Series([is_local, is_informational, is_commercial])

if 'Intents' in df.columns:
    df[['is_local', 'is_informational', 'is_commercial']] = df.apply(extract_intents_and_location, axis=1)

    # Create keyword clusters
    clusters = {
        'local_informational': df[(df['is_local']) & (df['is_informational'])],
        'local_commercial': df[(df['is_local']) & (df['is_commercial'])],
        'non_local_informational': df[(~df['is_local']) & (df['is_informational'])],
        'non_local_commercial': df[(~df['is_local']) & (df['is_commercial'])]
    }
    
    # Save keyword clusters
    for cluster_name, cluster_df in clusters.items():
        if not cluster_df.empty:
            cluster_df.sort_values(by='Volume', ascending=False)[['Keyword', 'Volume', 'CPC', 'Intents']].to_csv(
                f"{output_dir}/cluster_{cluster_name}.csv", index=False)

# Create visualizations
plt.figure(figsize=(12, 8))
sns.barplot(x='Volume', y='Keyword', data=top_volume_keywords)
plt.title('Top 20 Keywords by Search Volume')
plt.tight_layout()
plt.savefig(f"{output_dir}/top_keywords_volume.png")

# Create a visualization for keyword difficulty vs volume
plt.figure(figsize=(12, 8))
plt.scatter(df['Difficulty'], df['Volume'], alpha=0.6)
plt.title('Keyword Difficulty vs Search Volume')
plt.xlabel('Difficulty')
plt.ylabel('Search Volume')
plt.grid(True, linestyle='--', alpha=0.7)
plt.savefig(f"{output_dir}/difficulty_vs_volume.png")

# Create website structure recommendations based on keyword analysis
with open(f"{output_dir}/website_structure_recommendations.txt", 'w') as f:
    f.write("# Website Structure Recommendations Based on Keyword Analysis\n\n")
    
    # Homepage keywords
    f.write("## Homepage Keywords\n")
    homepage_keywords = df[df['Volume'] > 500].sort_values(by='Volume', ascending=False)
    for _, row in homepage_keywords.head(10).iterrows():
        f.write(f"- {row['Keyword']} (Volume: {row['Volume']})\n")
    
    # City-specific pages
    f.write("\n## City-specific Pages\n")
    city_keywords = df[df['Keyword'].str.contains('köln|berlin|hamburg|münchen|dresden|hannover', case=False)]
    city_keywords = city_keywords.sort_values(by='Volume', ascending=False)
    
    cities = ['köln', 'berlin', 'hamburg', 'münchen', 'dresden', 'hannover']
    for city in cities:
        city_specific = city_keywords[city_keywords['Keyword'].str.contains(city, case=False)]
        if not city_specific.empty:
            f.write(f"\n### {city.title()} Page\n")
            for _, row in city_specific.head(5).iterrows():
                f.write(f"- {row['Keyword']} (Volume: {row['Volume']})\n")
    
    # Feature-specific pages
    f.write("\n## Feature-specific Pages\n")
    features = ['eingezäunt', 'freilauf', 'indoor']
    for feature in features:
        feature_keywords = df[df['Keyword'].str.contains(feature, case=False)]
        feature_keywords = feature_keywords.sort_values(by='Volume', ascending=False)
        if not feature_keywords.empty:
            f.write(f"\n### {feature.title()} Feature Page\n")
            for _, row in feature_keywords.head(5).iterrows():
                f.write(f"- {row['Keyword']} (Volume: {row['Volume']})\n")
    
    # Blog content ideas
    f.write("\n## Blog Content Ideas\n")
    informational_keywords = df[df['Intents'].str.contains('Informational', case=False, na=False)]
    informational_keywords = informational_keywords.sort_values(by='Volume', ascending=False)
    for _, row in informational_keywords.head(15).iterrows():
        f.write(f"- {row['Keyword']} (Volume: {row['Volume']})\n")
    
    # Future affiliate content ideas
    f.write("\n## Future Affiliate Content Ideas\n")
    commercial_keywords = df[df['Intents'].str.contains('Commercial|Transactional', case=False, na=False)]
    commercial_keywords = commercial_keywords.sort_values(by='Volume', ascending=False)
    for _, row in commercial_keywords.head(10).iterrows():
        f.write(f"- {row['Keyword']} (Volume: {row['Volume']})\n")

print("Analysis complete. Results saved to:", output_dir)
